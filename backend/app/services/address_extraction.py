import json
import logging
from json import JSONDecodeError

from app.services.ai import generate_completion

logger = logging.getLogger(__name__)

EXTRACT_PROMPT = """
You are an expert at extracting company mailing addresses from job postings.

Read the job details provided by the user and return a SINGLE JSON object in exactly this shape:
{
  "found": true,
  "name": "<company name or hiring manager name>",
  "address_line1": "<street address>",
  "address_line2": "<suite, floor, etc. or empty string>",
  "city": "<city>",
  "state": "<state or province>",
  "zip": "<postal code>",
  "country": "<2-letter country code, e.g. US>"
}

Rules:
- Set "found" to true only if you can identify a reasonably complete physical mailing address.
- If no physical address is mentioned or inferable, return {"found": false}.
- Use the company name for the "name" field.
- Only extract US-based addresses. If the address is not in the US, return {"found": false}.
- Always set "country" to "US".
- Do not fabricate addresses. Only extract what is explicitly stated or strongly implied.
- Do not include any extra keys or text outside the JSON object.
""".strip()


async def extract_company_address(job_description: str, company_name: str | None = None) -> dict:
    context = f"Company: {company_name}\n\n" if company_name else ""
    try:
        raw = await generate_completion(
            system_prompt=EXTRACT_PROMPT,
            user_prompt=f"{context}Job posting details:\n\n{job_description[:3000]}",
            trace_name="address_extraction",
            json_mode=True,
            max_tokens=500,
        )
    except Exception as exc:
        logger.warning("Address extraction AI call failed: %s", exc, exc_info=True)
        return {"found": False}

    cleaned = raw.strip()

    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:])
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

    if "{" in cleaned and "}" in cleaned:
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        cleaned = cleaned[start:end].strip()

    if not cleaned:
        return {"found": False}

    try:
        data = json.loads(cleaned)
    except JSONDecodeError as exc:
        logger.warning("Address extraction JSON parse failed: %s; content=%r", exc, cleaned[:500])
        return {"found": False}

    if not isinstance(data, dict):
        return {"found": False}

    if not data.get("found"):
        return {"found": False}

    return {
        "found": True,
        "name": str(data.get("name", company_name or "")).strip(),
        "address_line1": str(data.get("address_line1", "")).strip(),
        "address_line2": str(data.get("address_line2", "")).strip(),
        "city": str(data.get("city", "")).strip(),
        "state": str(data.get("state", "")).strip(),
        "zip": str(data.get("zip", "")).strip(),
        "country": str(data.get("country", "US")).strip(),
    }
