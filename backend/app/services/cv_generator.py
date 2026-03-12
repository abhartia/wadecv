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
- Prioritize and reorder experience bullet points to highlight relevance to the target role
- Pay special attention to requirement sections in the job description such as "What We’re Looking For", "Qualifications", "Requirements", or "You Have". Treat these as the canonical list of must-have skills and experiences.
- Where it is truthful based on the candidate's CV and additional information, explicitly mirror the key phrases and keywords from these requirement sections in experience bullets and the skills block so the CV is a strong keyword match for those sections.
- Prefer using the employer’s own terms when honest (e.g. "cross-functional stakeholder management" instead of a looser synonym) to improve ATS and recruiter keyword matching, but never invent experience the candidate does not have.
- In the skills section (technical, soft, languages, certifications), include only skills that are clearly relevant to the target role and likely to influence hiring decisions; avoid long, low-signal lists of marginal tools or technologies.
- For very long skills lists, prefer grouping related items into compact phrases (for example, "cloud platforms (AWS, Azure, GCP)" instead of listing each separately) when it preserves clarity and truthfulness.
- Include all relevant, role-relevant skills from the original CV, adding any that are implied by experience.
- Keep the CV truthful - only enhance presentation, never fabricate experience
- Use concise, impactful language
- Ensure ATS compatibility with standard section headers
- If additional info is provided, incorporate it naturally into the relevant sections
- If the original CV or additional info mentions interests, hobbies, or extracurriculars, include an "interests" array with at least two distinct short items and no more than five. If you can identify only a single genuine interest, or are uncertain, set "interests" to an empty array instead of returning a single-item list.
- Aim for visually balanced section lengths: avoid one very long section (e.g. a huge experience block or massive Skills list) and a one-line summary; keep sections proportionally balanced where content allows.
- Do not repeat the same information in multiple sections. The professional summary should synthesize and highlight key themes, not restate experience bullets verbatim. List each skill or achievement in one place (e.g. either in the skills section or in a single, strong experience bullet) rather than repeating it in summary, skills, and bullets.
- Degrees (MBA, JD, MD, MSc, BSc, etc.) and degree-granting institutions must appear only in the Education section. Do not repeat degree names or schools in the Certifications field under Skills.
- The Certifications field under Skills must contain only non-degree credentials (for example, professional certifications, licenses, bar admissions, and similar). If an item is essentially just a degree or school name, omit it from Certifications and represent it only in Education.
- Within experience, avoid duplicate or near-duplicate bullets across roles. Each bullet should add new information; if the same type of achievement appears in multiple roles, keep the strongest or most relevant instance and vary or shorten the others.
- When the job description is primarily about strategy, leadership, operating cadence, stakeholder management, governance, or similar responsibilities, bias the CV strongly toward strategic impact and decision-making, cross-functional leadership, executive communication, and designing and running planning frameworks and operating rhythms. In these cases, keep technical stacks and tools as brief supporting context rather than long lists.
- When the job description is primarily about building or operating technical systems, data or AI products, or hands-on engineering or machine learning work, bias the CV strongly toward concrete technical skills, tools, architectures, implementation details, and measurable technical impact (for example reliability, scalability, performance, or accuracy). In these cases, include strategic or operational content only insofar as it supports the technical story.
- For strategy-oriented job descriptions, keep the `skills.technical` list to 2–3 compact, high-signal phrases and make `skills.soft` rich with items like executive-level stakeholder management, cross-functional leadership, operating cadence, strategy execution, change management, governance, and concise executive communication.
- For technically oriented job descriptions, allow a more detailed `skills.technical` list that captures the key languages, platforms, architectures, and tools that matter most for the role, while keeping `skills.soft` focused and brief.
- For strategy-oriented job descriptions, ensure the professional summary leads with strategic impact, leadership, and operating leverage, mentioning technical background only as context.
- For technically oriented job descriptions, ensure the professional summary leads with hands-on technical leadership and depth, mentioning strategy and operations only as they support the technical contributions.
- For strategy-oriented job descriptions, write experience bullets that lead with business outcomes, stakeholder alignment, governance, and cross-regional or cross-functional coordination, bringing in technical details only when they directly support those outcomes.
- For technically oriented job descriptions, write experience bullets that lead with technical design, implementation, and measurable technical results, bringing in strategy or operations only when they directly support those technical contributions.
- When you need to shorten the CV to meet a page limit, always start by removing or merging bullets that are **least relevant to the target job description** (generic, redundant, or weakly connected to the job’s responsibilities or requirements) while preserving highly relevant bullets and skills.
- Critically, preserve the candidate's complete work history: do not drop, hide, or merge past roles to save space. You may shorten or merge bullet points, but you must keep all distinct roles represented in the `experience` array with clear dates so total years of experience and any genuine gaps remain visible.
- For every experience entry, always populate `start_date` and `end_date`. Use a consistent, machine- and human-readable format such as "YYYY-MM" for months and years (e.g. "2019-06"), and use "Present" for ongoing roles where appropriate.
- If additional_info contains "Layout feedback" or "apply these tweaks", you MUST apply those tweaks: e.g. shorten the professional summary, reduce the number of bullets per role, or rebalance content as specified. Treat layout feedback as mandatory instructions. When the instructions say to keep the CV to one page, apply tweaks by shortening summary, experience bullets, and overly long Skills lists only; never remove or omit education entries or their details (degree, institution, dates, honors, coursework, thesis), and do not drop entire past roles; instead, summarize them more briefly if needed."""


PAGE_LIMIT_ONE_PROMPT = """

CRITICAL — PAGE LENGTH: This CV MUST fit on a SINGLE page. The document will be rendered with compact formatting (reduced margins and font size), so you can include full content in key sections while still fitting on one page.
- Professional summary: 2–3 concise sentences.
- Experience: Keep the 1–2 most recent roles relatively detailed with at most 2–3 short, high-impact bullet points each. For older roles, reduce to at most 1–2 bullets per role, dropping the least relevant points for the target job or merging similar bullets.
- Experience (layout feedback): When layout feedback instructs you to reduce bullets in a specific role, you MUST do so (for example, “reduce bullets in the 3rd role from 6 to 3, keeping only the most relevant points that match the job’s responsibilities or requirements”).
- Education: Include ALL degrees and qualifications. Do not omit or shorten education. List degree, institution, dates, and always populate "details" with honors, relevant coursework, thesis, or other education notes when present in the original CV or additional info. Education is important and must be complete.
- Skills: One compact block with the most relevant skills for this job. Prefer to keep skills that appear in or closely match the job posting, and drop unrelated items or group similar tools together.
- To save space, first trim from the professional summary, then from the number of experience bullets (starting with older roles), and finally from overly long Skills lists, while keeping education complete and truthful with all details."""

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

    # Normalize and post-process interests so we never surface a single-item list.
    raw_interests = parsed.get("interests", [])
    normalized_interests: list[str] = []
    if isinstance(raw_interests, str):
        # Split comma- or slash-separated strings into individual interests.
        parts = [p.strip() for chunk in raw_interests.split("/") for p in chunk.split(",")]
        normalized_interests = [p for p in parts if p]
    elif isinstance(raw_interests, list):
        for item in raw_interests:
            text = str(item).strip()
            if not text:
                continue
            normalized_interests.append(text)

    # Deduplicate while preserving order.
    seen: set[str] = set()
    deduped_interests: list[str] = []
    for item in normalized_interests:
        key = item.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped_interests.append(item)

    # If we end up with fewer than two distinct interests, clear the array entirely.
    parsed["interests"] = deduped_interests if len(deduped_interests) >= 2 else []

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
