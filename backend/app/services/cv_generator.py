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
- Pay special attention to requirement sections in the job description such as "What We’re Looking For", "Qualifications", "Requirements", or "You Have". Treat these as the canonical list of must-have skills and experiences.
- Where it is truthful based on the candidate's CV and additional information, explicitly mirror the key phrases and keywords from these requirement sections in experience bullets and the skills block so the CV is a strong keyword match for those sections.
- Prefer using the employer’s own terms when honest (e.g. "cross-functional stakeholder management" instead of a looser synonym) to improve ATS and recruiter keyword matching, but never invent experience the candidate does not have.
- In the skills section, include only skills that are clearly relevant to the target role and likely to influence hiring decisions; avoid long, low-signal lists of technologies or programming languages for roles that are not primarily hands-on technical (e.g. commercial, product, strategy, leadership).
- Include all relevant, role-relevant skills from the original CV, adding any that are implied by experience.
- Keep the CV truthful - only enhance presentation, never fabricate experience
- Use concise, impactful language
- Ensure ATS compatibility with standard section headers
- If additional info is provided, incorporate it naturally into the relevant sections
- If the original CV or additional info mentions interests, hobbies, or extracurriculars, include an "interests" array with 1–5 short items; otherwise omit or leave empty.
- Aim for visually balanced section lengths: avoid one very long section (e.g. a huge experience block) and a one-line summary; keep sections proportionally balanced where content allows.
- When you need to shorten the CV to meet a page limit, always start by removing or merging bullets that are **least relevant to the target job description** (generic, redundant, or weakly connected to the job’s responsibilities or requirements) while preserving highly relevant bullets.
- Critically, preserve the candidate's complete work history: do not drop, hide, or merge past roles to save space. You may shorten or merge bullet points, but you must keep all distinct roles represented in the `experience` array with clear dates so total years of experience and any genuine gaps remain visible.
- For every experience entry, always populate `start_date` and `end_date`. Use a consistent, machine- and human-readable format such as "YYYY-MM" for months and years (e.g. "2019-06"), and use "Present" for ongoing roles where appropriate.
- If additional_info contains "Layout feedback" or "apply these tweaks", you MUST apply those tweaks: e.g. shorten the professional summary, reduce the number of bullets per role, or rebalance content as specified. Treat layout feedback as mandatory instructions. When the instructions say to keep the CV to one page, apply tweaks by shortening summary and experience bullets only; never remove or omit education entries or their details (degree, institution, dates, honors, coursework, thesis), and do not drop entire past roles; instead, summarize them more briefly if needed."""


PAGE_LIMIT_ONE_PROMPT = """

CRITICAL — PAGE LENGTH: This CV MUST fit on a SINGLE page. The document will be rendered with compact formatting (reduced margins and font size), so you can include full content in key sections while still fitting on one page.
- Professional summary: 2–3 concise sentences.
- Experience: Keep the 1–2 most recent roles relatively detailed with at most 2–3 short, high-impact bullet points each. For older roles, reduce to at most 1–2 bullets per role, dropping the least relevant points for the target job or merging similar bullets.
- Experience (layout feedback): When layout feedback instructs you to reduce bullets in a specific role, you MUST do so (for example, “reduce bullets in the 3rd role from 6 to 3, keeping only the most relevant points that match the job’s responsibilities or requirements”).
- Education: Include ALL degrees and qualifications. Do not omit or shorten education. List degree, institution, dates, and always populate "details" with honors, relevant coursework, thesis, or other education notes when present in the original CV or additional info. Education is important and must be complete.
- Skills: One compact block with the most relevant skills.
- To save space, first trim from the professional summary and from the number of experience bullets (starting with older roles) while keeping education complete and truthful with all details."""

PAGE_LIMIT_TWO_PROMPT = """

PAGE LENGTH: This CV must fit on two pages. You may include a fuller professional summary and more experience bullets than a one-page CV. Do not exceed two pages."""


async def generate_cv(
    original_content: str,
    job_description: str,
    additional_info: str | None = None,
    user_id: str | None = None,
    cv_id: str | None = None,
    page_limit: Literal[1, 2] = 1,
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
        base: dict = {
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
        return base

    parsed = json.loads(cleaned)

    # Post-process to enforce date fields on experience entries even if the
    # model omitted them. We do not add or remove roles here; we only ensure
    # that each listed role has explicit start/end date keys so downstream
    # logic and ATS can reason about total years of experience.
    experience = parsed.get("experience")
    if isinstance(experience, list):
        for item in experience:
            if isinstance(item, dict):
                item.setdefault("start_date", "")
                item.setdefault("end_date", "")

    return parsed


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
