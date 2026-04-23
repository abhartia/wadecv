import io

from pypdf import PdfReader

from app.services.cv_layout_feedback import count_cv_pdf_pages
from app.services.docx_builder import build_cv_pdf


def test_count_cv_pdf_pages_matches_pypdf(monkeypatch):
    # Minimal cv_data that build_cv_pdf can handle; structure details are
    # delegated to the existing docx_builder tests and implementation.
    cv_data = {
        "personal_info": {"full_name": "Test User"},
        "sections": [],
    }

    pdf_bytes = build_cv_pdf(cv_data, page_limit=1)
    reader = PdfReader(io.BytesIO(pdf_bytes))
    expected_pages = len(reader.pages)

    counted_pages = count_cv_pdf_pages(cv_data, page_limit=1)
    assert counted_pages == expected_pages
