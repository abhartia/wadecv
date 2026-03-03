import uuid
import io

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.cv import CV
from app.models.cover_letter import CoverLetter
from app.schemas.cover_letter import CoverLetterGenerateRequest, CoverLetterUpdateRequest, CoverLetterResponse
from app.utils.auth import get_current_user
from app.services.cover_letter import generate_cover_letter
from app.services.docx_builder import build_cover_letter_docx, build_cover_letter_pdf

router = APIRouter()


@router.post("/generate", response_model=CoverLetterResponse)
async def generate(
    req: CoverLetterGenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Job).where(Job.id == uuid.UUID(req.job_id), Job.user_id == user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = await db.execute(select(CV).where(CV.id == job.cv_id))
    cv = result.scalar_one_or_none()
    if not cv or not cv.generated_cv_data:
        raise HTTPException(status_code=400, detail="CV must be generated before creating a cover letter")

    existing = await db.execute(
        select(CoverLetter).where(CoverLetter.job_id == job.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Cover letter already exists for this job. Delete it first to regenerate.")

    content = await generate_cover_letter(
        cv_data=cv.generated_cv_data,
        job_description=job.job_description,
        user_id=str(user.id),
        job_id=str(job.id),
    )

    if not content or not content.strip():
        raise HTTPException(status_code=502, detail="AI failed to generate cover letter content. Please try again.")

    cl = CoverLetter(job_id=job.id, cv_id=cv.id, content=content)
    db.add(cl)
    await db.flush()

    return CoverLetterResponse(
        id=str(cl.id), job_id=str(cl.job_id), cv_id=str(cl.cv_id),
        content=cl.content, created_at=cl.created_at.isoformat(),
    )


@router.get("/{job_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    job_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Job).where(Job.id == uuid.UUID(job_id), Job.user_id == user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = await db.execute(select(CoverLetter).where(CoverLetter.job_id == job.id))
    cl = result.scalar_one_or_none()
    if not cl:
        raise HTTPException(status_code=404, detail="Cover letter not found")

    return CoverLetterResponse(
        id=str(cl.id), job_id=str(cl.job_id), cv_id=str(cl.cv_id),
        content=cl.content, created_at=cl.created_at.isoformat(),
    )


@router.put("/{job_id}", response_model=CoverLetterResponse)
async def update_cover_letter(
    job_id: str,
    req: CoverLetterUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Job).where(Job.id == uuid.UUID(job_id), Job.user_id == user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = await db.execute(select(CoverLetter).where(CoverLetter.job_id == job.id))
    cl = result.scalar_one_or_none()
    if not cl:
        raise HTTPException(status_code=404, detail="Cover letter not found")

    cl.content = req.content
    await db.flush()

    return CoverLetterResponse(
        id=str(cl.id), job_id=str(cl.job_id), cv_id=str(cl.cv_id),
        content=cl.content, created_at=cl.created_at.isoformat(),
    )


@router.get("/{job_id}/download")
async def download_cover_letter(
    job_id: str,
    format: str = Query(
        "docx",
        pattern="^(docx|pdf)$",
        description="File format to download (docx or pdf)",
    ),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Job).where(Job.id == uuid.UUID(job_id), Job.user_id == user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = await db.execute(select(CoverLetter).where(CoverLetter.job_id == job.id))
    cl = result.scalar_one_or_none()
    if not cl:
        raise HTTPException(status_code=404, detail="Cover letter not found")

    result = await db.execute(select(CV).where(CV.id == cl.cv_id))
    cv = result.scalar_one_or_none()
    personal_info = cv.generated_cv_data.get("personal_info") if cv and cv.generated_cv_data else None

    full_name = ""
    if personal_info:
        raw_name = (personal_info.get("full_name") or "").strip()
        if raw_name:
            full_name = raw_name
    first_name = ""
    last_name = ""
    if full_name:
        parts = full_name.split()
        if len(parts) == 1:
            first_name = parts[0]
        else:
            first_name = parts[0]
            last_name = parts[-1]
    date_str = cl.created_at.date().isoformat()
    if first_name and last_name:
        base = f"{last_name}_{first_name}_Cover_Letter_{date_str}"
    elif first_name:
        base = f"{first_name}_Cover_Letter_{date_str}"
    else:
        base = f"Cover_Letter_{date_str}"
    safe_base = base.replace(" ", "_")

    if format == "pdf":
        pdf_bytes = build_cover_letter_pdf(cl.content, personal_info)
        filename = f"{safe_base}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename=\"{filename}\"'},
        )

    # default to DOCX
    docx_bytes = build_cover_letter_docx(cl.content, personal_info)
    filename = f"{safe_base}.docx"
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename=\"{filename}\"'},
    )


@router.delete("/{job_id}")
async def delete_cover_letter(
    job_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Job).where(Job.id == uuid.UUID(job_id), Job.user_id == user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    result = await db.execute(select(CoverLetter).where(CoverLetter.job_id == job.id))
    cl = result.scalar_one_or_none()
    if not cl:
        raise HTTPException(status_code=404, detail="Cover letter not found")

    await db.delete(cl)
    return {"message": "Cover letter deleted"}
