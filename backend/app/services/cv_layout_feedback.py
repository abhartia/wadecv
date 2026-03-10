"""
CV layout feedback: render CV to image, send to GPT-5 Nano for visual balance/layout
tweaks, return a list of actionable suggestions to pass into generate_cv as additional_info.
"""
import base64
import io
import json
import logging

from pypdf import PdfReader

from app.services.ai import generate_completion_with_image
from app.services.docx_builder import build_cv_pdf

logger = logging.getLogger(__name__)

LAYOUT_FEEDBACK_SYSTEM = """You are a CV layout expert. Look at this CV image and assess visual balance, density, and clarity.

Return ONLY a valid JSON object with this exact structure:
{
  "tweaks": [
    "Short, actionable tweak 1 (e.g. shorten professional summary to 2-3 sentences)",
    "Short, actionable tweak 2 (e.g. reduce bullets in first role to 3)",
    "..."
  ]
}

Guidelines:
- Give 2-5 specific, actionable tweaks that improve balance and readability.
- Focus on content/structure (summary length, number of bullets, section balance), not pixel-level design.
- If the CV already looks well balanced, return an empty tweaks array: {"tweaks": []}.
- Each tweak should be one short sentence that we can pass to a CV generator to apply."""

LAYOUT_FEEDBACK_USER = """Review this CV image and return your JSON with the "tweaks" array as specified."""

LAYOUT_FEEDBACK_USER_TWO_PAGES = """The following two images are page 1 and page 2 of a 2-page CV. Review both pages and return your JSON with the "tweaks" array as specified."""

LAYOUT_FEEDBACK_USER_ONE_PAGE = """This CV must fit on ONE page.

Suggest only tweaks that shorten or condense the professional summary and, especially, bullets under Professional Experience.

Be specific about where to trim:
- Prioritize keeping more detail in the 1–2 most recent roles and reducing bullets in older roles first.
- Prefer suggestions like “reduce bullets in the 3rd (older) role from 5 to 2, keeping only the most relevant points to the target job” over vague advice.
- You may suggest merging two similar bullets into one more compact bullet when appropriate.

Do not suggest removing or shortening education; education details must stay. Return your JSON with the "tweaks" array as specified."""

LAYOUT_FEEDBACK_USER_ONE_PAGE_OVERFLOW = """The following two images are page 1 and page 2 of a CV that must fit on ONE page. It is currently overflowing to a second page.

Suggest specific tweaks to shorten or condense content so it fits on one page, focusing primarily on Professional Experience bullets:
- Keep the 1–2 most recent roles relatively detailed (up to 2–3 bullets each).
- Aggressively reduce bullets in older roles (e.g. down to 1–2 bullets, or merge similar points) before trimming recent roles.
- Prefer precise instructions like “reduce bullets in the 2nd role from 6 to 3, dropping the least relevant points”.

Do not suggest removing or shortening education. Return your JSON with the "tweaks" array as specified."""


def _pdf_to_png_base64(pdf_bytes: bytes, page_limit: int = 1) -> list[str] | None:
    """Convert PDF page(s) to PNG. Always requests up to 2 pages so overflow is visible for 1-page CVs. Returns a list of base64 strings (one per page, up to 2), or None on failure."""
    try:
        from pdf2image import convert_from_bytes
        from pdf2image.exceptions import PDFInfoNotInstalledError
    except ImportError:
        logger.info("pdf2image not installed; skipping CV layout feedback image conversion")
        return None

    try:
        last_page = 2
        dpi = 150
        images = convert_from_bytes(pdf_bytes, first_page=1, last_page=last_page, dpi=dpi)
        if not images:
            return None

        logger.info(
            "Layout feedback PDF: page_limit=%s, requested up to page %s, got %s page(s)",
            page_limit,
            last_page,
            len(images),
        )
        result = []
        for img in images:
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            result.append(base64.b64encode(buf.getvalue()).decode("ascii"))
        return result
    except PDFInfoNotInstalledError as e:  # type: ignore[name-defined]
        # Poppler is not available; degrade gracefully and avoid noisy warnings
        logger.info("Poppler (pdfinfo) not installed; skipping CV layout feedback: %s", e)
        return None
    except Exception as e:  # noqa: BLE001
        logger.warning("PDF to image conversion failed: %s", e)
        return None


async def get_cv_layout_feedback(
    cv_data: dict,
    page_limit: int = 1,
    user_id: str | None = None,
    cv_id: str | None = None,
) -> list[str]:
    """
    Build the CV as PDF, convert page(s) to image(s) (one for 1-page CVs, two for 2-page CVs),
    send to the vision model, and return a list of layout tweak strings to pass to generate_cv
    as additional_info.

    Returns an empty list if image conversion or the API call fails (graceful degradation).
    """
    try:
        pdf_bytes = build_cv_pdf(cv_data, page_limit=page_limit)
    except Exception as e:
        logger.warning("build_cv_pdf failed in layout feedback: %s", e)
        return []

    images_b64 = _pdf_to_png_base64(pdf_bytes, page_limit=page_limit)
    if not images_b64:
        return []

    num_images = len(images_b64)
    logger.info("Layout feedback: sending %s image(s) to vision (page_limit=%s)", num_images, page_limit)

    try:
        if page_limit == 1 and num_images == 2:
            user_prompt = LAYOUT_FEEDBACK_USER_ONE_PAGE_OVERFLOW
        elif page_limit == 1:
            user_prompt = LAYOUT_FEEDBACK_USER_ONE_PAGE
        else:
            user_prompt = LAYOUT_FEEDBACK_USER_TWO_PAGES
        raw = await generate_completion_with_image(
            system_prompt=LAYOUT_FEEDBACK_SYSTEM,
            user_prompt=user_prompt,
            image_base64=images_b64,
            trace_name="cv_layout_feedback",
            metadata={"user_id": user_id, "cv_id": cv_id},
            json_mode=True,
            max_tokens=16000,
        )
    except Exception as e:
        logger.warning("Layout feedback API call failed: %s", e)
        return []

    if not raw or not raw.strip():
        logger.debug("Layout feedback returned empty response; skipping tweaks")
        return []

    cleaned = raw.strip()
    # Strip markdown code fences if present (e.g. ```json ... ```)
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:])
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()
    # Try to isolate JSON object between first { and last }
    if "{" in cleaned and "}" in cleaned:
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        cleaned = cleaned[start:end]

    try:
        data = json.loads(cleaned)
        tweaks = data.get("tweaks") or []
        return [t.strip() for t in tweaks if isinstance(t, str) and t.strip()]
    except (json.JSONDecodeError, TypeError) as e:
        logger.warning(
            "Layout feedback JSON parse failed: %s. Raw (first 300 chars): %s",
            e,
            (raw[:300] + "..." if len(raw) > 300 else raw) if raw else "(empty)",
        )
        return []


def count_cv_pdf_pages(cv_data: dict, page_limit: int = 1) -> int:
    """
    Deterministically count the number of pages for a rendered CV PDF.

    This uses the same PDF-building path as layout feedback (build_cv_pdf) and
    pypdf's PdfReader for page counting, without any AI calls.

    On failure, logs and returns the requested page_limit so we do not
    accidentally trigger infinite layout refinement loops.
    """
    try:
        pdf_bytes = build_cv_pdf(cv_data, page_limit=page_limit)
    except Exception as e:  # noqa: BLE001
        logger.warning("build_cv_pdf failed in count_cv_pdf_pages: %s", e)
        return page_limit

    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        num_pages = len(reader.pages)
        logger.info(
            "Deterministic page count for CV: pages=%s (page_limit=%s)",
            num_pages,
            page_limit,
        )
        return num_pages
    except Exception as e:  # noqa: BLE001
        logger.warning("PdfReader failed in count_cv_pdf_pages: %s", e)
        return page_limit
