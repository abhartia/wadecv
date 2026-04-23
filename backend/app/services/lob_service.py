import io
import logging

import httpx
from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.lib.pagesizes import LETTER

from app.config import get_settings
from app.services.docx_builder import build_cover_letter_pdf, build_cv_pdf

logger = logging.getLogger(__name__)

# US Letter in points (612 x 792)
LETTER_W, LETTER_H = LETTER


def _build_address_page(to_address: dict, from_address: dict) -> bytes:
    """Build a US Letter cover page for Lob to print addresses on.

    Lob overlays mailing addresses, barcodes, and postage on page 1.
    This dedicated page keeps the actual CV/cover letter content clean.
    """
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=LETTER,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=4.5 * inch,
        bottomMargin=1 * inch,
    )
    styles = getSampleStyleSheet()
    story: list = []
    story.append(Spacer(1, 0))
    story.append(
        Paragraph(
            "This page is used for mailing purposes. Your documents follow on the next page(s).",
            styles["Normal"],
        )
    )
    doc.build(story)
    return buf.getvalue()


def _resize_to_letter(pdf_bytes: bytes) -> bytes:
    """Scale all pages of a PDF to US Letter (8.5 x 11 in) for Lob compatibility."""
    reader = PdfReader(io.BytesIO(pdf_bytes))
    writer = PdfWriter()
    for page in reader.pages:
        w = float(page.mediabox.width)
        h = float(page.mediabox.height)
        # Already letter-sized (within 1pt tolerance)
        if abs(w - LETTER_W) < 1 and abs(h - LETTER_H) < 1:
            writer.add_page(page)
            continue
        sx = LETTER_W / w
        sy = LETTER_H / h
        scale = min(sx, sy)
        # Center the content on the letter page
        tx = (LETTER_W - w * scale) / 2
        ty = (LETTER_H - h * scale) / 2
        page.add_transformation(
            Transformation().scale(scale, scale).translate(tx / scale, ty / scale)
        )
        page.mediabox.upper_right = (LETTER_W, LETTER_H)
        page.mediabox.lower_left = (0, 0)
        writer.add_page(page)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def merge_pdfs(pdf_bytes_list: list[bytes]) -> bytes:
    writer = PdfWriter()
    for pdf_bytes in pdf_bytes_list:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            writer.add_page(page)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def build_mail_pdf(
    content_type: str,
    cv_data: dict | None,
    cover_letter_content: str | None,
    personal_info: dict | None,
    page_limit: int = 1,
) -> bytes:
    pdfs: list[bytes] = []

    if content_type in ("cover_letter_only", "both") and cover_letter_content:
        pdfs.append(build_cover_letter_pdf(cover_letter_content, personal_info))

    if content_type in ("cv_only", "both") and cv_data:
        pdfs.append(build_cv_pdf(cv_data, page_limit))

    if not pdfs:
        raise ValueError("No content available to build mail PDF")

    if len(pdfs) == 1:
        return pdfs[0]

    return merge_pdfs(pdfs)


async def send_letter(
    to_address: dict,
    from_address: dict,
    pdf_bytes: bytes,
    description: str = "WadeCV Application",
) -> str:
    settings = get_settings()
    if not settings.lob_api_key:
        raise RuntimeError("Lob API key is not configured")

    def _format_address(addr: dict) -> dict:
        return {
            "name": addr.get("name", ""),
            "address_line1": addr.get("address_line1", ""),
            "address_line2": addr.get("address_line2", ""),
            "address_city": addr.get("city", ""),
            "address_state": addr.get("state", ""),
            "address_zip": addr.get("zip", ""),
            "address_country": "US",
        }

    # Prepend an address page so Lob's address/barcode overlay doesn't
    # obstruct the actual CV/cover letter content on page 1.
    address_page = _build_address_page(to_address, from_address)
    pdf_bytes = merge_pdfs([address_page, pdf_bytes])

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.lob.com/v1/letters",
            auth=(settings.lob_api_key, ""),
            data={
                "description": description,
                "color": "true",
                "double_sided": "false",
                **{f"to[{k}]": v for k, v in _format_address(to_address).items()},
                **{f"from[{k}]": v for k, v in _format_address(from_address).items()},
            },
            files={"file": ("application.pdf", pdf_bytes, "application/pdf")},
        )

    if response.status_code not in (200, 201):
        error_detail = response.text[:500]
        logger.error("Lob API error %d: %s", response.status_code, error_detail)
        try:
            lob_error = response.json().get("error", {}).get("message", "")
        except Exception:
            lob_error = ""
        raise RuntimeError(lob_error or f"Lob API error: {response.status_code}")

    data = response.json()
    lob_letter_id = data.get("id", "")
    logger.info("Lob letter created: %s", lob_letter_id)
    return lob_letter_id
