import asyncio
import logging
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import io

logger = logging.getLogger(__name__)

from app.database import get_db
from app.models.user import User
from app.models.cv import CV
from app.models.job import Job
from app.schemas.cv import CVUploadResponse, CVGenerateRequest, CVUpdateRequest, CVRefineRequest, CVResponse, CVListItem
from app.utils.auth import get_current_user
from app.utils.filename import job_suffix_for_filename
from app.utils.parsing import parse_cv_file
from app.services.cv_generator import generate_cv, generate_fit_analysis
from app.services.job_metadata import extract_job_metadata
from app.services.credits import deduct_credit
from app.services.scraper import scrape_job_url
from app.services.docx_builder import build_cv_docx, build_cv_pdf

router = APIRouter()


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
    # Existing application regeneration flow: identified by job_id
    if req.job_id:
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

        original_content = cv.original_content
        additional_info = cv.additional_info
        job_description = job.job_description or ""

        if not job_description:
            raise HTTPException(
                status_code=400,
                detail="Job description is missing for this application",
            )

        page_limit = cv.page_limit if cv.page_limit else 2

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

        cv.generated_cv_data = cv_data
        cv.fit_analysis = fit_analysis
        cv.status = "generated"

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

    # New application flow: create or reuse CV and create a new job, deducting one credit
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
        raise HTTPException(status_code=400, detail="Either job_url or job_description is required")

    job_description = req.job_description or ""
    job_title = None
    company_name = None

    if req.job_url:
        try:
            scraped = await scrape_job_url(req.job_url)
        except Exception:
            if not job_description:
                raise HTTPException(status_code=400, detail="Could not scrape job URL and no description provided")
        else:
            success = scraped.get("success", True)
            if success:
                job_description = scraped.get("job_description", job_description)
                job_title = scraped.get("job_title") or job_title
                company_name = scraped.get("company_name") or company_name
            else:
                # When validation fails, rely on any description the user provided.
                if not job_description:
                    raise HTTPException(status_code=400, detail="Could not scrape job URL and no description provided")

    if not job_title or not company_name:
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

    cv_data, fit_analysis = await asyncio.gather(
        generate_cv(
            original_content=original_content,
            job_description=job_description,
            additional_info=combined_additional,
            user_id=str(user.id),
            cv_id=str(cv.id),
            page_limit=cv.page_limit if cv.page_limit else 2,
        ),
        generate_fit_analysis(
            original_content=original_content,
            job_description=job_description,
            additional_info=combined_additional,
        ),
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
        pdf_bytes = build_cv_pdf(cv.generated_cv_data, page_limit=getattr(cv, "page_limit", 2) or 2)
        filename = f"{safe_base}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename=\"{filename}\"'},
        )

    # default to DOCX
    docx_bytes = build_cv_docx(cv.generated_cv_data, page_limit=getattr(cv, "page_limit", 2) or 2)
    filename = f"{safe_base}.docx"
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename=\"{filename}\"'},
    )
