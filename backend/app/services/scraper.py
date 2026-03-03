import httpx
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import json
import logging
from typing import Any, Tuple

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
) -> Tuple[bool, str | None, str]:
    """
    Use an LLM to assess whether the scraped content looks like a real job description
    and, when successful, return a cleaned-up version of the description.
    Returns (success, reason, cleaned_description).
    """
    # Quick heuristic: clearly too-short content is unlikely to be a full job description.
    if not job_description or len(job_description) < 200:
        # In this case we treat validation as failed and just echo back the original text
        # as the \"cleaned\" version so callers always have something to work with.
        return False, "The scraped text was too short to be a full job description.", job_description

    # Trim very long descriptions to keep token usage reasonable.
    trimmed_description = job_description[:4000]

    system_prompt = (
        "You are validating whether scraped text is a complete job description for a job posting URL.\n"
        "Respond ONLY with a JSON object of the form:\n"
        "{"
        "\"success\": true/false,"
        "\"reason\": \"short, user-facing explanation or null\","
        "\"cleaned_description\": \"the full job description text, cleaned but NOT shortened\""
        "}.\n"
        "Rules for cleaned_description:\n"
        "- Do NOT summarize or shorten. Do NOT drop any job-related content or bullet points.\n"
        "- You MAY remove obvious non-job chrome such as cookie banners, navigation, headers/footers, or ads if you can confidently identify them.\n"
        "- You MAY normalize whitespace, line breaks, and stray HTML artifacts.\n"
        "- You MAY remove exact duplicate paragraphs, but keep all distinct content.\n"
        "Set success to false if the text is clearly incomplete, mostly navigation/cookie banners, "
        "login-required, unrelated content, or otherwise not a real job description. "
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
            max_tokens=2048,
        )

        data: Any = json.loads(raw)
        success = bool(data.get("success", True))
        reason = data.get("reason")
        if reason is not None:
            reason = str(reason)
        cleaned = data.get("cleaned_description") or ""
        if cleaned is not None:
            cleaned = str(cleaned)
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
        return success, reason, cleaned
    except Exception as exc:
        logger.warning("Job scrape validation failed; defaulting to success. error=%s", exc)
        # On validator failure, treat the original description as the cleaned version so
        # downstream code continues to behave as before.
        return True, None, job_description


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

    job_description = cleaned if success and cleaned else (description or "")

    return {
        "job_description": job_description,
        "job_title": metadata.get("job_title"),
        "company_name": metadata.get("company_name"),
        "success": success,
        "reason": reason,
    }
