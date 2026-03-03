import json
from typing import Literal

from app.services.ai import generate_completion

FIT_ANALYSIS_SYSTEM_PROMPT = """You are an expert recruiter and career advisor. Given a candidate's CV and a target job description,
assess how well the candidate fits the role.

Return ONLY a valid JSON object with this exact structure:
{
  "fit_score": <integer 0-100>,
  "strengths": ["reason the candidate is a good fit", ...],
  "gaps": ["reason the candidate might not be a good fit", ...]
}

Guidelines:
- fit_score should reflect the overall match (0 = no match, 100 = perfect match)
- strengths should list specific, concrete reasons drawn from the CV that align with the job requirements
- gaps should list specific requirements from the job that the candidate's CV does not clearly address
- Be honest but fair — only flag genuine gaps, not minor preferences
- Typically provide 3-6 strengths and 1-5 gaps
- Each reason should be a single clear sentence"""


CV_SYSTEM_PROMPT = """You are an expert CV/resume writer. Given a candidate's existing CV content and a job description, 
create a tailored, professional CV optimized for the target role.

Return ONLY a valid JSON object with this exact structure:
{
  "personal_info": {
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "professional_summary": "",
  "experience": [
    {
      "job_title": "",
      "company": "",
      "location": "",
      "start_date": "",
      "end_date": "",
      "bullets": [""]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "start_date": "",
      "end_date": "",
      "details": ""
    }
  ],
  "skills": {
    "technical": [""],
    "soft": [""],
    "languages": [""],
    "certifications": [""]
  },
  "interests": []
}

Guidelines:
- Tailor the professional summary specifically to the target job
- Rewrite experience bullet points using strong action verbs and quantified achievements
- Prioritize and reorder experience bullets to highlight relevance to the target role
- Include all relevant skills from the original CV, adding any that are implied by experience
- Keep the CV truthful - only enhance presentation, never fabricate experience
- Use concise, impactful language
- Ensure ATS compatibility with standard section headers
- If additional info is provided, incorporate it naturally into the relevant sections
- If the original CV or additional info mentions interests, hobbies, or extracurriculars, include an "interests" array with 1–5 short items; otherwise omit or leave empty."""


PAGE_LIMIT_ONE_PROMPT = """

CRITICAL — PAGE LENGTH: This CV MUST fit on a SINGLE page. The document will be rendered with compact formatting (reduced margins and font size), so you can include full content in key sections while still fitting on one page.
- Professional summary: 2–3 concise sentences.
- Experience: Focus on the 2–3 most relevant roles. Use at most 2–3 short bullet points per role. If there are additional roles, summarize them briefly in one combined line (e.g. under “Additional Experience”) instead of full bullet lists.
- Education: Include ALL degrees and qualifications. Do not omit or shorten education. List degree, institution, dates, and key details (honors, relevant coursework, or thesis if applicable). Education is important and must be complete.
- Skills: One compact block with the most relevant skills.
- To save space, first trim from the professional summary and from the number of experience bullets; keep education complete and truthful."""

PAGE_LIMIT_TWO_PROMPT = """

PAGE LENGTH: This CV must fit on two pages. You may include a fuller professional summary and more experience bullets than a one-page CV. Do not exceed two pages."""


async def generate_cv(
    original_content: str,
    job_description: str,
    additional_info: str | None = None,
    user_id: str | None = None,
    cv_id: str | None = None,
    page_limit: Literal[1, 2] = 2,
) -> dict:
    page_instruction = PAGE_LIMIT_ONE_PROMPT if page_limit == 1 else PAGE_LIMIT_TWO_PROMPT
    system_prompt = CV_SYSTEM_PROMPT + page_instruction + "\n\nReturn ONLY valid JSON. No explanation, no formatting, no comments."

    user_prompt_parts = [
        f"## Existing CV Content\n{original_content}",
        f"\n## Target Job Description\n{job_description}",
    ]
    if additional_info:
        user_prompt_parts.append(f"\n## Additional Information\n{additional_info}")

    user_prompt = "\n".join(user_prompt_parts)

    raw_response = await generate_completion(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        trace_name="cv_generation",
        metadata={"user_id": user_id, "cv_id": cv_id},
        # Keep JSON mode enabled so the API enforces JSON,
        # and give the reasoning model more completion budget
        # so it has room to both reason and emit JSON.
        json_mode=True,
        temperature=1.0,
        max_tokens=16000,
    )

    cleaned = raw_response.strip()

    # Strip surrounding markdown code fences if present
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # drop the first ```... line
        cleaned = "\n".join(lines[1:])
        if cleaned.endswith("```"):
            cleaned = cleaned[: -3].strip()

    # Try to isolate the JSON object between the first "{" and the last "}"
    if "{" in cleaned and "}" in cleaned:
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        cleaned = cleaned[start:end].strip()

    if not cleaned:
        # Fall back to an empty-but-well-structured CV object so the
        # API still returns a valid payload instead of a 500 error.
        return {
            "personal_info": {
                "full_name": "",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "website": "",
            },
            "professional_summary": "",
            "experience": [],
            "education": [],
            "skills": {
                "technical": [],
                "soft": [],
                "languages": [],
                "certifications": [],
            },
            "interests": [],
        }

    return json.loads(cleaned)


async def generate_fit_analysis(
    original_content: str,
    job_description: str,
    additional_info: str | None = None,
) -> dict:
    user_prompt_parts = [
        f"## Candidate CV\n{original_content}",
        f"\n## Target Job Description\n{job_description}",
    ]
    if additional_info:
        user_prompt_parts.append(f"\n## Additional Candidate Information\n{additional_info}")

    user_prompt = "\n".join(user_prompt_parts)

    try:
        raw_response = await generate_completion(
            system_prompt=FIT_ANALYSIS_SYSTEM_PROMPT
            + "\n\nReturn ONLY valid JSON. No explanation, no formatting, no comments.",
            user_prompt=user_prompt,
            trace_name="fit_analysis",
            json_mode=True,
            temperature=1.0,
            max_tokens=8000,
        )
    except Exception:
        return {"fit_score": 0, "strengths": [], "gaps": []}

    cleaned = raw_response.strip()
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
        return {"fit_score": 0, "strengths": [], "gaps": []}

    result = json.loads(cleaned)
    result.setdefault("fit_score", 0)
    result.setdefault("strengths", [])
    result.setdefault("gaps", [])
    return result
