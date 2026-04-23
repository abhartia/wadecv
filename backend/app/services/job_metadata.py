import json
import logging
from json import JSONDecodeError

from app.services.ai import generate_completion

logger = logging.getLogger(__name__)

EXTRACT_PROMPT = """
You are an expert recruitment assistant.

Read the job details provided by the user and return a SINGLE JSON object in exactly this shape:
{
  "job_title": "<job title>",
  "company_name": "<company name>"
}

Rules:
- Always include BOTH keys: "job_title" and "company_name".
- Infer a reasonable job title and company name from the text and any hints.
- Avoid null whenever reasonably possible. Use null ONLY if there is truly no signal at all.
- If multiple roles or companies are mentioned, choose the primary one being advertised.
- If the company is clearly generic/unnamed, you may use a generic descriptor like "Technology Company".
- Do not include any extra keys or text outside the JSON object.
""".strip()


def _extract_field(data: dict, candidates: list[str]) -> str | None:
    for key in candidates:
        value = data.get(key)
        if value:
            return str(value).strip()
    return None


async def extract_job_metadata(job_description: str) -> dict:
    try:
        raw = await generate_completion(
            system_prompt=EXTRACT_PROMPT,
            user_prompt=f"Job posting details:\\n\\n{job_description[:3000]}",
            trace_name="job_metadata_extraction",
            json_mode=True,
            max_tokens=4000,
        )
    except Exception as exc:
        logger.warning("Job metadata AI call failed: %s", exc, exc_info=True)
        return {"job_title": None, "company_name": None}

    cleaned = raw.strip()

    # Handle optional markdown fences (```json ... ```)
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:])
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

    # If the model included extra text around the JSON, isolate the object.
    if "{" in cleaned and "}" in cleaned:
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        cleaned = cleaned[start:end].strip()

    if not cleaned:
        logger.warning("Job metadata extraction returned empty content")
        return {"job_title": None, "company_name": None}

    try:
        data = json.loads(cleaned)
    except JSONDecodeError as exc:
        logger.warning("Job metadata JSON parse failed: %s; content=%r", exc, cleaned[:500])
        return {"job_title": None, "company_name": None}

    if not isinstance(data, dict):
        logger.warning("Job metadata JSON was not an object: %r", type(data))
        return {"job_title": None, "company_name": None}

    job_title = _extract_field(
        data,
        [
            "job_title",
            "title",
            "role",
            "position",
            "jobTitle",
            "jobtitle",
        ],
    )

    company_name = _extract_field(
        data,
        [
            "company_name",
            "company",
            "employer",
            "organization",
            "organisation",
            "companyName",
        ],
    )

    if job_title is None and company_name is None:
        logger.warning(
            "Job metadata AI returned no title/company. cleaned_response=%r",
            cleaned[:500],
        )

    logger.info(
        "Job metadata extracted via JSON mode: title=%r company=%r description_len=%d",
        job_title,
        company_name,
        len(job_description or ""),
    )

    return {
        "job_title": job_title,
        "company_name": company_name,
    }
