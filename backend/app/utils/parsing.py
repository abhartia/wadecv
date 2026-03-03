import io
from docx import Document
import pdfplumber


def parse_pdf(file_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n\n".join(text_parts)


def parse_docx(file_bytes: bytes) -> str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


def parse_cv_file(file_bytes: bytes, filename: str) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        return parse_pdf(file_bytes)
    elif lower.endswith(".docx"):
        return parse_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: {filename}. Please upload PDF or DOCX.")
