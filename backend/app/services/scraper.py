import json
import logging
from typing import Any
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup

from app.services.ai import generate_completion

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

PLATFORM_SELECTORS = {
    "linkedin.com": [
        ".description__text",
        ".show-more-less-html__markup",
        "[class*='job-description']",
    ],
    "indeed.com": [
        "#jobDescriptionText",
        ".jobsearch-jobDescriptionText",
    ],
    "greenhouse.io": [
        "[class*='job-description']",
        ".content",
        "#content .content",
        "#content",
        ".content__body",
    ],
    "lever.co": [
        ".section-wrapper",
        "[class*='posting-']",
    ],
    "workday.com": [
        "[data-automation-id='jobPostingDescription']",
    ],
}


def _get_platform(url: str) -> str | None:
    host = urlparse(url).hostname or ""
    for platform in PLATFORM_SELECTORS:
        if platform in host:
            return platform
    return None


def _extract_with_selectors(soup: BeautifulSoup, selectors: list[str]) -> str | None:
    for selector in selectors:
        el = soup.select_one(selector)
        if el:
            text = el.get_text(separator="\n", strip=True)
            if len(text) > 50:
                return text
    return None


def _extract_generic(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()

    for container_tag in ["main", "article", "[role='main']"]:
        container = soup.select_one(container_tag)
        if container:
            text = container.get_text(separator="\n", strip=True)
            if len(text) > 100:
                return text

    return soup.get_text(separator="\n", strip=True)[:5000]


# Phrases that mark the start of application form or footer junk; we truncate before the earliest.
_FORM_START_MARKERS = [
    "indicates a required field",
    "Autofill with MyGreenhouse",
    "Create a Job Alert",
    "Create alert",
    "Apply for this job",
    "First Name\n*",
    "Resume/CV\n*",
    "Dropbox\nGoogle Drive",
    "Please choose your preferred office locations",
    "Accepted file types: pdf, doc, docx",
    "How did you hear about us?",
    "How did you hear about ",
    "Submit application",
    "We do not accept unsolicited resumes",
    "Any employment agency",
]


_LEADING_NAV_LINES = ("back to jobs", "back to search", "apply")


def _strip_application_form_junk(text: str) -> str:
    """Truncate at the first occurrence of form/footer markers and strip leading nav so the box gets only role content."""
    if not text or len(text) < 50:
        return text
    # Drop leading lines that are just navigation (e.g. "Back to jobs", "Apply")
    lines = text.split("\n")
    while lines and lines[0].strip().lower() in _LEADING_NAV_LINES:
        lines.pop(0)
    text = "\n".join(lines).lstrip()

    lower = text.lower()
    cut = len(text)
    for marker in _FORM_START_MARKERS:
        idx = lower.find(marker.lower())
        if idx != -1 and idx < cut:
            cut = idx
    if cut < len(text):
        text = text[:cut]
    text = text.rstrip()
    # Remove trailing hashtag like #LI-HA1
    while text and text.split() and text.split()[-1].startswith("#"):
        text = text[: text.rfind(text.split()[-1])].rstrip()
    return text


def _extract_metadata(soup: BeautifulSoup) -> dict:
    title = None
    company = None

    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = og_title["content"]

    title_tag = soup.find("title")
    if not title and title_tag:
        parts = title_tag.get_text().split(" - ")
        if len(parts) >= 2:
            title = parts[0].strip()
            company = parts[1].strip()

    og_site = soup.find("meta", property="og:site_name")
    if not company and og_site and og_site.get("content"):
        company = og_site["content"]

    return {"job_title": title, "company_name": company}


async def _validate_scraped_job(
    url: str,
    job_description: str,
    job_title: str | None,
    company_name: str | None,
) -> tuple[bool, str | None, str]:
    """
    Use an LLM to assess whether the scraped content looks like a real job description
    and, when successful, return a cleaned-up version of the description.
    Returns (success, reason, cleaned_description).
    """
    # Quick heuristic: clearly too-short content is unlikely to be a full job description.
    if not job_description or len(job_description) < 200:
        # In this case we treat validation as failed and just echo back the original text
        # as the \"cleaned\" version so callers always have something to work with.
        return (
            False,
            "The scraped text was too short to be a full job description.",
            job_description,
        )

    # Trim very long descriptions to keep token usage reasonable; allow enough context to see where form starts.
    trimmed_description = job_description[:6000]

    system_prompt = (
        "You are validating whether scraped text is a complete job description for a job posting URL.\n"
        "Respond ONLY with a JSON object of the form:\n"
        "{\n"
        '"success": true/false,\n'
        '"reason": "short, user-facing explanation or null",\n'
        '"cleaned_description": "the full job description text, cleaned but NOT shortened"\n'
        "}.\n\n"
        "The cleaned_description must read as a single, coherent job description suitable for feeding into a CV/cover-letter generator. "
        "It must NOT contain any application form, buttons, or legal boilerplate.\n\n"
        "REMOVE (do not include in output):\n"
        "- Navigation and breadcrumbs: e.g. 'Back to jobs', 'Back to search', standalone 'Apply' button/link text.\n"
        "- Application form UI: labels and fields such as 'First Name', 'Last Name', 'Email', 'Phone', 'Resume/CV', 'Attach', 'Dropbox', 'Google Drive', 'Enter manually', 'Submit application', 'Select...', dropdown option lists, 'Please choose your preferred office locations', checkbox lists, 'How did you hear about us', etc.\n"
        "- Application CTAs: 'Create a Job Alert', 'Get future opportunities sent straight to your email', 'Create alert', 'Apply for this job' when part of or followed by the form.\n"
        "- Long legal/EEO boilerplate: full Equal Opportunity Employer paragraphs, 'We do not discriminate on the basis of...', 'We are committed to building a team...'. You may keep a single short line e.g. 'X is an Equal Opportunity Employer.' if present once.\n"
        "- Recruiter/agency disclaimers: e.g. 'we do not accept unsolicited resumes from third-party recruiters', 'Any employment agency... submits an unsolicited resume...'.\n"
        "- Job-posting metadata that is not the role: hashtags like '#LI-HA1', 'Create a Job Alert' / 'Interested in building your career...'.\n\n"
        "KEEP (output must contain only):\n"
        "- Job title and location (if at top of description).\n"
        "- Company overview (one short block if present).\n"
        "- Position overview, responsibilities, requirements, qualifications, 'You Have', 'You Are', salary/benefits if stated once.\n"
        "- No form fields, no duplicate EEO blocks, no application instructions.\n\n"
        "Additional rules: Do NOT summarize or shorten job-related content. You MAY normalize whitespace and line breaks. "
        "Set success to false if the text is clearly incomplete, mostly navigation/form, login-required, or unrelated. "
        "When success is false, reason must explain in plain language what went wrong."
    )

    user_parts: list[str] = [
        f"Job posting URL: {url}",
    ]
    if job_title:
        user_parts.append(f"Job title (if known): {job_title}")
    if company_name:
        user_parts.append(f"Company name (if known): {company_name}")
    user_parts.append("Scraped text:")
    user_parts.append(trimmed_description)

    user_prompt = "\n\n".join(user_parts)

    try:
        raw = await generate_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            trace_name="job_scrape_validation",
            metadata={"url": url},
            json_mode=True,
            temperature=0.0,
            max_tokens=32768,
        )

        cleaned_raw = raw.strip()
        # Strip markdown code fences if present (e.g. ```json ... ```)
        if cleaned_raw.startswith("```"):
            lines = cleaned_raw.split("\n")
            cleaned_raw = "\n".join(lines[1:])
            if cleaned_raw.endswith("```"):
                cleaned_raw = cleaned_raw[:-3].strip()
        # Extract JSON object between first { and last }
        if "{" in cleaned_raw and "}" in cleaned_raw:
            start = cleaned_raw.find("{")
            end = cleaned_raw.rfind("}") + 1
            cleaned_raw = cleaned_raw[start:end]

        data: Any = json.loads(cleaned_raw)
        success = bool(data.get("success", True))
        reason = data.get("reason")
        if reason is not None:
            reason = str(reason)
        # Accept both snake_case and camelCase from the model
        cleaned = data.get("cleaned_description") or data.get("cleanedDescription") or ""
        cleaned = str(cleaned).strip() if cleaned is not None else ""
        # If the model explicitly says success is false but did not supply a reason,
        # backfill a generic message so the frontend has something user-facing.
        if not success and not reason:
            reason = "We couldn't reliably extract this job description automatically."
        # If validation succeeded but no cleaned_description was provided, fall back to the original text.
        if success and not cleaned:
            cleaned = job_description
        # If validation failed and cleaned is empty, also fall back so callers can still inspect the raw text.
        if not success and not cleaned:
            cleaned = job_description
        # Always strip form/footer junk so the description box never gets application UI
        cleaned = _strip_application_form_junk(cleaned)
        return success, reason, cleaned
    except Exception as exc:
        logger.warning("Job scrape validation failed; defaulting to success. error=%s", exc)
        # On validator failure, treat the original description as the cleaned version so
        # downstream code continues to behave as before.
        cleaned = _strip_application_form_junk(job_description)
        return True, None, cleaned


async def scrape_job_url(url: str) -> dict:
    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0, headers=HEADERS) as client:
        resp = await client.get(url)
        resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    platform = _get_platform(url)

    description = None
    if platform:
        description = _extract_with_selectors(soup, PLATFORM_SELECTORS[platform])

    if not description:
        description = _extract_generic(soup)

    metadata = _extract_metadata(soup)

    success, reason, cleaned = await _validate_scraped_job(
        url=url,
        job_description=description or "",
        job_title=metadata.get("job_title"),
        company_name=metadata.get("company_name"),
    )

    # Prefer cleaned output whenever the model returned one; only fall back to raw when cleaned is empty
    job_description = cleaned if cleaned else (description or "")

    return {
        "job_description": job_description,
        "job_title": metadata.get("job_title"),
        "company_name": metadata.get("company_name"),
        "success": success,
        "reason": reason,
    }
