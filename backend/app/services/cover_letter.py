from app.services.ai import generate_completion

COVER_LETTER_SYSTEM_PROMPT = """You are an expert cover letter writer. Given a tailored CV and a job description,
write a compelling, professional cover letter.

Guidelines:
- Address the letter professionally (use "Dear Hiring Manager" if no specific name)
- Open with a strong hook that shows enthusiasm for the specific role
- Highlight 2-3 key qualifications that directly match the job requirements
- Use specific examples from the CV to demonstrate value
- Show knowledge of the company/role where possible
- Keep it concise - 3-4 paragraphs maximum
- Close with a clear call to action
- End with a separate sign-off block: leave a blank line, then put "Sincerely," on its own line and the candidate's full name from the CV data on the next line (do not attach "Sincerely" directly to the previous sentence).
- Professional but personable tone
- Do NOT include addresses or date headers - just the letter body

Return only the cover letter text, no additional formatting or metadata."""


async def generate_cover_letter(
    cv_data: dict,
    job_description: str,
    user_id: str | None = None,
    job_id: str | None = None,
) -> str:
    import json

    cv_summary = json.dumps(cv_data, indent=2)

    user_prompt = f"## Tailored CV Data\n{cv_summary}\n\n## Job Description\n{job_description}"

    return await generate_completion(
        system_prompt=COVER_LETTER_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        trace_name="cover_letter_generation",
        metadata={"user_id": user_id, "job_id": job_id},
        temperature=0.7,
        max_tokens=8000,
    )
