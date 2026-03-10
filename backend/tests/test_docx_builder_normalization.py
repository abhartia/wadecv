import pytest

from app.services.docx_builder import _clean_text


@pytest.mark.parametrize(
    "raw,expected",
    [
        ("Python–driven", "Python-driven"),
        ("back‑office", "back-office"),
        ("data\u2012driven", "data-driven"),
        ("range\u201320", "range-20"),
        ("value\u221210", "value-10"),
        ("skills \u2022 Python \u2022 SQL", "skills   Python   SQL"),
        ("middle\u00B7dot", "middle dot"),
        ("\u25A0 boxed", "  boxed"),
        ("non\u00A0breaking space", "non breaking space"),
    ],
)
def test_clean_text_normalizes_problematic_unicode(raw: str, expected: str) -> None:
    cleaned = _clean_text(raw)
    assert cleaned == expected

