import asyncio
import io
import logging
import uuid
from collections.abc import Awaitable, Callable

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.cv import CV
from app.models.job import Job
from app.models.user import User
from app.schemas.cv import (
    CVGenerationProgressEvent,
    CVGenerationStage,
    CVGenerateRequest,
    CVListItem,
    CVRefineRequest,
    CVResponse,
    CVUpdateRequest,
    CVUploadResponse,
)
from app.services.credits import deduct_credit
from app.services.cv_generator import generate_cv, generate_fit_analysis
from app.services.cv_layout_feedback import get_cv_layout_feedback
from app.services.docx_builder import build_cv_docx, build_cv_pdf
from app.services.job_metadata import extract_job_metadata
from app.services.scraper import scrape_job_url
from app.utils.auth import get_current_user
from app.utils.filename import job_suffix_for_filename
from app.utils.parsing import parse_cv_file

logger = logging.getLogger(__name__)

router = APIRouter()


async def _emit_event(
    emit: Callable[[CVGenerationProgressEvent], Awaitable[None]] | None,
    *,
    type_: str,
    stage: CVGenerationStage,
    message: str,
    progress: int | None = None,
    cv_id: str | None = None,
    job_id: str | None = None,
    result: CVResponse | None = None,
) -> None:
    if not emit:
        return

    event = CVGenerationProgressEvent(
        type=type_,
        stage=stage,
        message=message,
        progress=progress,
        cv_id=cv_id,
        job_id=job_id,
        result=result,
    )
    await emit(event)


async def _apply_layout_feedback_and_regenerate(
    *,
    cv_data: dict,
    original_content: str,
    job_description: str,
    additional_info: str | None,
    page_limit: int,
    user: User,
    cv: CV,
    emit: Callable[[CVGenerationProgressEvent], Awaitable[None]] | None = None,
    job: Job | None = None,
    progress: int | None = None,
) -> dict:
    """
    Run the CV layout feedback pipeline and, if tweaks are suggested, regenerate the CV
    with those tweaks applied as additional instructions.
    """
    layout_tweaks = await get_cv_layout_feedback(
        cv_data,
        page_limit=page_limit,
        user_id=str(user.id),
        cv_id=str(cv.id),
    )
    if not layout_tweaks:
        return cv_data

    if emit:
        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.LAYOUT_FEEDBACK,
            message="Applying layout feedback and regenerating CV",
            progress=progress,
            cv_id=str(cv.id),
            job_id=str(job.id) if job else None,
        )

    layout_feedback_text = "Layout feedback (apply these tweaks):\n" + "\n".join(
        "- " + t for t in layout_tweaks
    )
    if page_limit == 1:
        layout_feedback_text = (
            "CRITICAL: This is a one-page CV. Apply the tweaks by shortening or "
            "condensing the professional summary and experience bullets only; do not add "
            "new content and do NOT remove or omit education. Keep all education entries "
            "with degree, institution, dates, and details (honors, coursework, thesis). "
            "The result must still fit on one page.\n\n" + layout_feedback_text
        )

    combined_for_second = (additional_info or "") + "\n\n" + layout_feedback_text

    return await generate_cv(
        original_content=original_content,
        job_description=job_description,
        additional_info=combined_for_second,
        user_id=str(user.id),
        cv_id=str(cv.id),
        page_limit=page_limit,
    )


async def _run_cv_generation(
    req: CVGenerateRequest,
    user: User,
    db: AsyncSession,
    emit: Callable[[CVGenerationProgressEvent], Awaitable[None]] | None = None,
) -> CVResponse:
    await _emit_event(
        emit,
        type_="progress",
        stage=CVGenerationStage.START,
        message="Starting CV generation",
        progress=0,
    )

    # Existing application regeneration flow: identified by job_id
    if req.job_id:
        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.SETUP,
            message="Loading existing job and CV",
            progress=5,
        )
        try:
            job_uuid = uuid.UUID(req.job_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid job_id")

        result = await db.execute(
            select(Job).where(Job.id == job_uuid, Job.user_id == user.id)
        )
        job = result.scalar_one_or_none()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        result = await db.execute(
            select(CV).where(CV.id == job.cv_id, CV.user_id == user.id)
        )
        cv = result.scalar_one_or_none()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found for job")

        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.SETUP,
            message="Loaded existing job and CV",
            progress=10,
            cv_id=str(cv.id),
            job_id=str(job.id),
        )

        original_content = cv.original_content
        additional_info = cv.additional_info
        job_description = job.job_description or ""

        if not job_description:
            raise HTTPException(
                status_code=400,
                detail="Job description is missing for this application",
            )

        page_limit = cv.page_limit if cv.page_limit else 1

        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.FIRST_PASS_GENERATION,
            message="Generating tailored CV and fit analysis",
            progress=30,
            cv_id=str(cv.id),
            job_id=str(job.id),
        )

        cv_data, fit_analysis = await asyncio.gather(
            generate_cv(
                original_content=original_content,
                job_description=job_description,
                additional_info=additional_info,
                user_id=str(user.id),
                cv_id=str(cv.id),
                page_limit=page_limit,
            ),
            generate_fit_analysis(
                original_content=original_content,
                job_description=job_description,
                additional_info=additional_info,
            ),
        )

        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.FIRST_PASS_GENERATION,
            message="First-pass CV and fit analysis generated",
            progress=60,
            cv_id=str(cv.id),
            job_id=str(job.id),
        )

        cv_data = await _apply_layout_feedback_and_regenerate(
            cv_data=cv_data,
            original_content=original_content,
            job_description=job_description,
            additional_info=additional_info,
            page_limit=page_limit,
            user=user,
            cv=cv,
            emit=emit,
            job=job,
            progress=75,
        )

        cv.generated_cv_data = cv_data
        cv.fit_analysis = fit_analysis
        cv.status = "generated"

        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.SAVING,
            message="Saving generated CV",
            progress=90,
            cv_id=str(cv.id),
            job_id=str(job.id),
        )

        await db.flush()

        response = CVResponse(
            id=str(cv.id),
            original_filename=cv.original_filename,
            original_content=cv.original_content,
            additional_info=cv.additional_info,
            generated_cv_data=cv.generated_cv_data,
            fit_analysis=cv.fit_analysis,
            page_limit=cv.page_limit,
            job_id=str(job.id),
            status=cv.status,
            created_at=cv.created_at.isoformat(),
        )

        await _emit_event(
            emit,
            type_="done",
            stage=CVGenerationStage.DONE,
            message="CV generation completed",
            progress=100,
            cv_id=response.id,
            job_id=response.job_id,
            result=response,
        )

        return response

    # New application flow: create or reuse CV and create a new job, deducting one credit
    await _emit_event(
        emit,
        type_="progress",
        stage=CVGenerationStage.SETUP,
        message="Preparing CV and job details",
        progress=5,
    )

    cv = None
    original_content = ""
    additional_info = req.additional_info

    if req.cv_id:
        result = await db.execute(
            select(CV).where(CV.id == uuid.UUID(req.cv_id), CV.user_id == user.id)
        )
        cv = result.scalar_one_or_none()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        original_content = cv.original_content
    elif user.base_cv_content:
        original_content = user.base_cv_content
        if not additional_info:
            additional_info = user.additional_info
    else:
        raise HTTPException(
            status_code=400,
            detail="No CV uploaded and no profile set up. Upload a CV or set up your profile first.",
        )

    if not req.job_description and not req.job_url:
        raise HTTPException(
            status_code=400,
            detail="Either job_url or job_description is required",
        )

    job_description = req.job_description or ""
    job_title = None
    company_name = None

    if req.job_url:
        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.SCRAPING_JOB,
            message="Scraping job URL for description and metadata",
            progress=10,
        )
        try:
            scraped = await scrape_job_url(req.job_url)
        except Exception:  # noqa: BLE001
            if not job_description:
                raise HTTPException(
                    status_code=400,
                    detail="Could not scrape job URL and no description provided",
                )
        else:
            success = scraped.get("success", True)
            if success:
                job_description = scraped.get("job_description", job_description)
                job_title = scraped.get("job_title") or job_title
                company_name = scraped.get("company_name") or company_name
            else:
                # When validation fails, rely on any description the user provided.
                if not job_description:
                    raise HTTPException(
                        status_code=400,
                        detail="Could not scrape job URL and no description provided",
                    )

    if not job_title or not company_name:
        await _emit_event(
            emit,
            type_="progress",
            stage=CVGenerationStage.JOB_METADATA,
            message="Extracting job title and company from description",
            progress=20,
        )
        try:
            metadata = await extract_job_metadata(job_description)
            if not job_title:
                job_title = metadata.get("job_title")
            if not company_name:
                company_name = metadata.get("company_name")
        except Exception as exc:  # noqa: BLE001
            logger.warning("Job metadata extraction failed: %s", exc, exc_info=True)

    logger.info(
        "Job metadata before Job creation: title=%r company=%r description_len=%d from_url=%s",
        job_title,
        company_name,
        len(job_description or ""),
        bool(req.job_url),
    )

    await _emit_event(
        emit,
        type_="progress",
        stage=CVGenerationStage.DEDUCT_CREDIT,
        message="Deducting credit",
        progress=25,
    )

    await deduct_credit(db, user.id)

    if cv is None:
        cv = CV(
            user_id=user.id,
            original_filename="profile",
            original_content=original_content,
            additional_info=additional_info,
            status="generated",
            page_limit=req.page_limit,
        )
        db.add(cv)
        await db.flush()
    else:
        if req.additional_info:
            cv.additional_info = req.additional_info
        cv.page_limit = req.page_limit

    await _emit_event(
        emit,
        type_="progress",
        stage=CVGenerationStage.FIRST_PASS_GENERATION,
        message="Generating tailored CV and fit analysis",
        progress=45,
        cv_id=str(cv.id),
    )

    cv_data, fit_analysis = await asyncio.gather(
        generate_cv(
            original_content=original_content,
            job_description=job_description,
            additional_info=additional_info,
            user_id=str(user.id),
            cv_id=str(cv.id),
            page_limit=req.page_limit,
        ),
        generate_fit_analysis(
            original_content=original_content,
            job_description=job_description,
            additional_info=additional_info,
        ),
    )

    await _emit_event(
        emit,
        type_="progress",
        stage=CVGenerationStage.FIRST_PASS_GENERATION,
        message="First-pass CV and fit analysis generated",
        progress=70,
        cv_id=str(cv.id),
    )

    cv_data = await _apply_layout_feedback_and_regenerate(
        cv_data=cv_data,
        original_content=original_content,
        job_description=job_description,
        additional_info=additional_info,
        page_limit=req.page_limit,
        user=user,
        cv=cv,
        emit=emit,
        progress=80,
    )

    cv.generated_cv_data = cv_data
    cv.fit_analysis = fit_analysis
    cv.status = "generated"

    user.cv_page_limit = req.page_limit

    job = Job(
        user_id=user.id,
        cv_id=cv.id,
        job_url=req.job_url,
        job_description=job_description,
        company_name=company_name,
        job_title=job_title,
        application_status="generated",
    )
    db.add(job)

    await _emit_event(
        emit,
        type_="progress",
        stage=CVGenerationStage.SAVING,
        message="Saving generated CV and job",
        progress=90,
        cv_id=str(cv.id),
        job_id=str(job.id),
    )

    await db.flush()

    response = CVResponse(
        id=str(cv.id),
        original_filename=cv.original_filename,
        original_content=cv.original_content,
        additional_info=cv.additional_info,
        generated_cv_data=cv.generated_cv_data,
        fit_analysis=cv.fit_analysis,
        page_limit=cv.page_limit,
        job_id=str(job.id),
        status=cv.status,
        created_at=cv.created_at.isoformat(),
    )

    await _emit_event(
        emit,
        type_="done",
        stage=CVGenerationStage.DONE,
        message="CV generation completed",
        progress=100,
        cv_id=response.id,
        job_id=response.job_id,
        result=response,
    )

    return response


@router.post("/upload", response_model=CVUploadResponse)
async def upload_cv(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    try:
        text = parse_cv_file(contents, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    if not user.base_cv_content:
        user.base_cv_content = text

    cv = CV(
        user_id=user.id,
        original_filename=file.filename,
        original_content=text,
        status="uploaded",
    )
    db.add(cv)
    await db.flush()

    return CVUploadResponse(
        id=str(cv.id),
        original_filename=cv.original_filename,
        original_content=cv.original_content,
        status=cv.status,
        created_at=cv.created_at.isoformat(),
    )


@router.post("/generate", response_model=CVResponse)
async def generate_cv_endpoint(
    req: CVGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _run_cv_generation(req=req, user=user, db=db)


@router.post("/generate/stream")
async def generate_cv_stream(
    req: CVGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    queue: asyncio.Queue[CVGenerationProgressEvent | None] = asyncio.Queue()

    async def emit(event: CVGenerationProgressEvent) -> None:
        await queue.put(event)

    async def producer() -> None:
        try:
            await _run_cv_generation(req=req, user=user, db=db, emit=emit)
        except HTTPException as exc:
            await emit(
                CVGenerationProgressEvent(
                    type="error",
                    stage=CVGenerationStage.ERROR,
                    message=str(exc.detail),
                    progress=None,
                    cv_id=None,
                    job_id=None,
                    result=None,
                )
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning("Streaming CV generation failed: %s", exc, exc_info=True)
            await emit(
                CVGenerationProgressEvent(
                    type="error",
                    stage=CVGenerationStage.ERROR,
                    message="Unexpected error during CV generation",
                    progress=None,
                    cv_id=None,
                    job_id=None,
                    result=None,
                )
            )
        finally:
            await queue.put(None)

    async def event_generator():
        producer_task = asyncio.create_task(producer())
        try:
            while True:
                event = await queue.get()
                if event is None:
                    break
                data = event.model_dump_json()
                yield (data + "\n").encode("utf-8")
        finally:
            await producer_task

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")


@router.put("/{cv_id}", response_model=CVResponse)
async def update_cv(
    cv_id: str,
    req: CVUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CV).where(CV.id == uuid.UUID(cv_id), CV.user_id == user.id)
    )
    cv = result.scalar_one_or_none()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")

    cv.generated_cv_data = req.generated_cv_data
    await db.flush()

    return CVResponse(
        id=str(cv.id),
        original_filename=cv.original_filename,
        original_content=cv.original_content,
        additional_info=cv.additional_info,
        generated_cv_data=cv.generated_cv_data,
        fit_analysis=cv.fit_analysis,
        page_limit=cv.page_limit,
        status=cv.status,
        created_at=cv.created_at.isoformat(),
    )


@router.get("/{cv_id}", response_model=CVResponse)
async def get_cv(
    cv_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CV).where(CV.id == uuid.UUID(cv_id), CV.user_id == user.id)
    )
    cv = result.scalar_one_or_none()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")

    return CVResponse(
        id=str(cv.id),
        original_filename=cv.original_filename,
        original_content=cv.original_content,
        additional_info=cv.additional_info,
        generated_cv_data=cv.generated_cv_data,
        fit_analysis=cv.fit_analysis,
        page_limit=cv.page_limit,
        status=cv.status,
        created_at=cv.created_at.isoformat(),
    )


@router.post("/{cv_id}/refine", response_model=CVResponse)
async def refine_cv(
    cv_id: str,
    req: CVRefineRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CV).where(CV.id == uuid.UUID(cv_id), CV.user_id == user.id)
    )
    cv = result.scalar_one_or_none()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    if not cv.jobs:
        raise HTTPException(status_code=400, detail="No job associated with this CV")

    job = cv.jobs[0]
    job_description = job.job_description or ""
    original_content = cv.original_content

    feedback_lines: list[str] = []
    for _gap, explanation in req.gap_feedback.items():
        explanation = explanation.strip()
        if explanation:
            feedback_lines.append(f"- {explanation}")

    if not feedback_lines:
        raise HTTPException(status_code=400, detail="No feedback provided")

    feedback_text = "\n".join(feedback_lines)
    combined_additional = cv.additional_info or ""
    if combined_additional:
        combined_additional += "\n\n"
    combined_additional += "Candidate clarifications on potential gaps:\n" + feedback_text
    page_limit = cv.page_limit if cv.page_limit else 1

    cv_data_first = await generate_cv(
        original_content=original_content,
        job_description=job_description,
        additional_info=combined_additional,
        user_id=str(user.id),
        cv_id=str(cv.id),
        page_limit=page_limit,
    )
    cv_data = await _apply_layout_feedback_and_regenerate(
        cv_data=cv_data_first,
        original_content=original_content,
        job_description=job_description,
        additional_info=combined_additional,
        page_limit=page_limit,
        user=user,
        cv=cv,
    )
    fit_analysis = await generate_fit_analysis(
        original_content=original_content,
        job_description=job_description,
        additional_info=combined_additional,
    )

    cv.generated_cv_data = cv_data
    cv.fit_analysis = fit_analysis
    cv.additional_info = combined_additional

    existing_profile_info = user.additional_info or ""
    if existing_profile_info:
        existing_profile_info += "\n\n"
    user.additional_info = existing_profile_info + feedback_text

    await db.flush()

    return CVResponse(
        id=str(cv.id),
        original_filename=cv.original_filename,
        original_content=cv.original_content,
        additional_info=cv.additional_info,
        generated_cv_data=cv.generated_cv_data,
        fit_analysis=cv.fit_analysis,
        page_limit=cv.page_limit,
        job_id=str(job.id),
        status=cv.status,
        created_at=cv.created_at.isoformat(),
    )


@router.get("/", response_model=list[CVListItem])
async def list_cvs(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CV).where(CV.user_id == user.id).order_by(CV.created_at.desc())
    )
    cvs = result.scalars().all()
    items = []
    for cv in cvs:
        job_title = None
        company_name = None
        if cv.jobs:
            job_title = cv.jobs[0].job_title
            company_name = cv.jobs[0].company_name
        items.append(CVListItem(
            id=str(cv.id),
            original_filename=cv.original_filename,
            status=cv.status,
            created_at=cv.created_at.isoformat(),
            job_title=job_title,
            company_name=company_name,
        ))
    return items


@router.get("/{cv_id}/download")
async def download_cv(
    cv_id: str,
    format: str = Query(
        "docx",
        pattern="^(docx|pdf)$",
        description="File format to download (docx or pdf)",
    ),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CV).where(CV.id == uuid.UUID(cv_id), CV.user_id == user.id)
    )
    cv = result.scalar_one_or_none()
    if not cv or not cv.generated_cv_data:
        raise HTTPException(status_code=404, detail="Generated CV not found")

    personal_info = cv.generated_cv_data.get("personal_info", {}) or {}
    full_name = (personal_info.get("full_name") or "").strip()
    first_name = ""
    last_name = ""
    if full_name:
        parts = full_name.split()
        if len(parts) == 1:
            first_name = parts[0]
        else:
            first_name = parts[0]
            last_name = parts[-1]
    date_str = cv.created_at.date().isoformat()
    job_suffix = ""
    if cv.jobs:
        job = cv.jobs[0]
        job_suffix = job_suffix_for_filename(job.company_name, job.job_title)
    if job_suffix:
        mid = f"_{job_suffix}_"
    else:
        mid = "_"
    if first_name and last_name:
        base = f"{last_name}_{first_name}_Resume{mid}{date_str}"
    elif first_name:
        base = f"{first_name}_Resume{mid}{date_str}"
    else:
        base = f"Resume{mid}{date_str}"
    safe_base = base.replace(" ", "_")

    if format == "pdf":
        pdf_bytes = build_cv_pdf(cv.generated_cv_data, page_limit=getattr(cv, "page_limit", 1) or 1)
        filename = f"{safe_base}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename=\"{filename}\"'},
        )

    # default to DOCX
    docx_bytes = build_cv_docx(cv.generated_cv_data, page_limit=getattr(cv, "page_limit", 1) or 1)
    filename = f"{safe_base}.docx"
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename=\"{filename}\"'},
    )
