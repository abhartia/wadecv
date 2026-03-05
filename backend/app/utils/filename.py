"""Helpers for building safe download filenames."""

import re


# Characters that are invalid or problematic in filenames on common OSes
_FILENAME_UNSAFE_RE = re.compile(r'[\s\\/:*?"<>|]+')


def sanitize_for_filename(value: str | None, max_length: int = 40) -> str:
    """Sanitize a string for use in a filename (e.g. company name or job title).

    Replaces spaces and invalid chars with underscores, strips leading/trailing
    underscores, and truncates to max_length. Returns empty string if value is
    None or empty after stripping.
    """
    if not value or not (s := str(value).strip()):
        return ""
    s = _FILENAME_UNSAFE_RE.sub("_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s[:max_length] if max_length else s


def job_suffix_for_filename(company_name: str | None, job_title: str | None) -> str:
    """Build a sanitized suffix from company and job title for use in filenames.

    Returns something like "Acme_Corp_Software_Engineer" or "Acme_Corp" or
    "Software_Engineer" or "" if both are missing.
    """
    company = sanitize_for_filename(company_name)
    role = sanitize_for_filename(job_title)
    if company and role:
        return f"{company}_{role}"
    return company or role
