import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.job import Job
from app.schemas.job import JobResponse, JobUpdateRequest, ScrapeRequest, ScrapeResponse
from app.utils.auth import get_current_user
from app.services.scraper import scrape_job_url

router = APIRouter()


@router.get("/", response_model=list[JobResponse])
async def list_jobs(
    status_filter: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Job).where(Job.user_id == user.id).order_by(Job.created_at.desc())
    if status_filter:
        query = query.where(Job.application_status == status_filter)

    result = await db.execute(query)
    jobs = result.scalars().all()

    return [
        JobResponse(
            id=str(j.id),
            cv_id=str(j.cv_id),
            job_url=j.job_url,
            job_description=j.job_description,
            company_name=j.company_name,
            job_title=j.job_title,
            application_status=j.application_status,
            applied_at=j.applied_at.isoformat() if j.applied_at else None,
            created_at=j.created_at.isoformat(),
            fit_score=(
                (j.cv.fit_analysis or {}).get("fit_score")
                if getattr(j, "cv", None) and isinstance(j.cv.fit_analysis, dict)
                else None
            ),
        )
        for j in jobs
    ]


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
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

    return JobResponse(
        id=str(job.id),
        cv_id=str(job.cv_id),
        job_url=job.job_url,
        job_description=job.job_description,
        company_name=job.company_name,
        job_title=job.job_title,
        application_status=job.application_status,
        applied_at=job.applied_at.isoformat() if job.applied_at else None,
        created_at=job.created_at.isoformat(),
        fit_score=(
            (job.cv.fit_analysis or {}).get("fit_score")
            if getattr(job, "cv", None) and isinstance(job.cv.fit_analysis, dict)
            else None
        ),
    )


@router.patch("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    req: JobUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Job).where(Job.id == uuid.UUID(job_id), Job.user_id == user.id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if req.application_status is not None:
        valid = {"generated", "cv_accepted", "cv_rejected"}
        if req.application_status not in valid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(sorted(valid))}",
            )
        job.application_status = req.application_status
    if req.company_name is not None:
        job.company_name = req.company_name
    if req.job_title is not None:
        job.job_title = req.job_title
    if req.applied_at is not None:
        job.applied_at = datetime.fromisoformat(req.applied_at)

    await db.flush()

    return JobResponse(
        id=str(job.id), cv_id=str(job.cv_id), job_url=job.job_url,
        job_description=job.job_description, company_name=job.company_name,
        job_title=job.job_title, application_status=job.application_status,
        applied_at=job.applied_at.isoformat() if job.applied_at else None,
        created_at=job.created_at.isoformat(),
    )


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_job(req: ScrapeRequest, user: User = Depends(get_current_user)):
    try:
        result = await scrape_job_url(req.url)
        return ScrapeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to scrape URL: {str(e)}")
