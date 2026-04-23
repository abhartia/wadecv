import json
import logging

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.cover_letter import CoverLetter
from app.models.cv import CV
from app.models.job import Job
from app.models.physical_mail import PhysicalMail
from app.models.user import User
from app.schemas.physical_mail import (
    ExtractAddressRequest,
    ExtractAddressResponse,
    PhysicalMailResponse,
)
from app.services.address_extraction import extract_company_address
from app.services.credits import add_credits, deduct_credits
from app.services.docx_builder import build_cover_letter_pdf, build_cv_pdf
from app.services.lob_service import _resize_to_letter, merge_pdfs, send_letter
from app.utils.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

MAIL_CREDIT_COST = 5


@router.post("/extract-address", response_model=ExtractAddressResponse)
async def extract_address(
    req: ExtractAddressRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Job).where(Job.id == req.job_id, Job.user_id == user.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    address_data = await extract_company_address(job.job_description, job.company_name)
    return ExtractAddressResponse(**address_data)


@router.post("/send", response_model=PhysicalMailResponse)
async def send_mail(
    job_id: str = Form(...),
    content_type: str = Form(...),
    to_address: str = Form(...),
    from_address: str = Form(...),
    save_return_address: bool = Form(True),
    custom_cv_pdf: UploadFile | None = File(None),
    custom_cover_letter_pdf: UploadFile | None = File(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Parse JSON address fields
    try:
        to_addr = json.loads(to_address)
        from_addr = json.loads(from_address)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid address format")

    if content_type not in ("cv_only", "cover_letter_only", "both"):
        raise HTTPException(status_code=400, detail="Invalid content_type")

    # Load job
    result = await db.execute(select(Job).where(Job.id == job_id, Job.user_id == user.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    # Load CV
    result = await db.execute(select(CV).where(CV.id == job.cv_id))
    cv = result.scalar_one_or_none()
    if not cv or not cv.generated_cv_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="CV has not been generated yet"
        )

    # Load cover letter if needed
    cover_letter_content = None
    personal_info = cv.generated_cv_data.get("personal_info")
    if content_type in ("cover_letter_only", "both"):
        result = await db.execute(select(CoverLetter).where(CoverLetter.job_id == job.id))
        cl = result.scalar_one_or_none()
        if not cl and not custom_cover_letter_pdf:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cover letter has not been generated yet",
            )
        if cl:
            cover_letter_content = cl.content

    # Read custom PDF files if provided
    custom_cv_bytes = None
    custom_cl_bytes = None
    if custom_cv_pdf and custom_cv_pdf.filename:
        custom_cv_bytes = await custom_cv_pdf.read()
        if len(custom_cv_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Custom CV PDF too large (max 10MB)")
    if custom_cover_letter_pdf and custom_cover_letter_pdf.filename:
        custom_cl_bytes = await custom_cover_letter_pdf.read()
        if len(custom_cl_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400, detail="Custom cover letter PDF too large (max 10MB)"
            )

    # Deduct credits
    await deduct_credits(db, user.id, MAIL_CREDIT_COST, "physical_mail", "Physical mail sending")

    # Build PDF — use custom uploads when provided, otherwise generate
    try:
        pdfs: list[bytes] = []

        if content_type in ("cover_letter_only", "both"):
            if custom_cl_bytes:
                pdfs.append(custom_cl_bytes)
            elif cover_letter_content:
                pdfs.append(build_cover_letter_pdf(cover_letter_content, personal_info))

        if content_type in ("cv_only", "both"):
            if custom_cv_bytes:
                pdfs.append(custom_cv_bytes)
            else:
                pdfs.append(build_cv_pdf(cv.generated_cv_data, cv.page_limit or 1))

        if not pdfs:
            raise ValueError("No content available to build mail PDF")

        pdf_bytes = pdfs[0] if len(pdfs) == 1 else merge_pdfs(pdfs)
        pdf_bytes = _resize_to_letter(pdf_bytes)
    except Exception as exc:
        logger.error("Failed to build mail PDF: %s", exc, exc_info=True)
        await add_credits(
            db, user.id, MAIL_CREDIT_COST, "physical_mail_refund", "Refund: mail PDF build failed"
        )
        await db.commit()
        raise HTTPException(status_code=500, detail="Failed to build mail PDF")

    # Send via Lob
    description = f"WadeCV - {job.company_name or 'Application'} - {job.job_title or 'Position'}"

    try:
        lob_letter_id = await send_letter(to_addr, from_addr, pdf_bytes, description)
    except Exception as exc:
        logger.error("Lob API call failed: %s", exc, exc_info=True)
        await add_credits(
            db, user.id, MAIL_CREDIT_COST, "physical_mail_refund", "Refund: Lob API failed"
        )

        mail_record = PhysicalMail(
            user_id=user.id,
            job_id=job.id,
            content_type=content_type,
            to_address=to_addr,
            from_address=from_addr,
            status="failed",
            credits_charged=0,
            error_message=str(exc)[:500],
        )
        db.add(mail_record)
        await db.commit()

        lob_msg = str(exc).lower()
        if "deliverability" in lob_msg or "address" in lob_msg:
            user_msg = "The recipient address could not be verified as deliverable. Please double-check the address and try again."
        elif "dimension" in lob_msg or "file" in lob_msg:
            user_msg = "There was an issue with the PDF format. Please try uploading a US Letter (8.5 x 11 in) PDF."
        else:
            user_msg = "Something went wrong while sending your mail. Please try again later."
        raise HTTPException(
            status_code=502, detail=f"{user_msg} Your 5 credits have been refunded."
        )

    # Save record
    mail_record = PhysicalMail(
        user_id=user.id,
        job_id=job.id,
        lob_letter_id=lob_letter_id,
        content_type=content_type,
        to_address=to_addr,
        from_address=from_addr,
        status="sent",
        credits_charged=MAIL_CREDIT_COST,
        custom_cv_pdf=custom_cv_bytes,
        custom_cover_letter_pdf=custom_cl_bytes,
    )
    db.add(mail_record)

    # Save return address to profile
    if save_return_address:
        user.mailing_address = from_addr

    await db.flush()

    return PhysicalMailResponse(
        id=str(mail_record.id),
        job_id=str(mail_record.job_id),
        lob_letter_id=mail_record.lob_letter_id,
        content_type=mail_record.content_type,
        status=mail_record.status,
        credits_charged=mail_record.credits_charged,
        created_at=mail_record.created_at.isoformat(),
    )
