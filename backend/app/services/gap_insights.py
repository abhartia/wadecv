import json
import logging
import uuid
from collections import Counter
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session
from app.models.user import User
from app.models.job import Job
from app.models.cv import CV
from app.services.ai import generate_completion


logger = logging.getLogger(__name__)


MIN_APPLICATIONS_FOR_INSIGHTS = 10
REFRESH_INTERVAL = 10
MAX_TOP_GAPS = 10


async def _count_user_jobs(db: AsyncSession, user: User) -> int:
    result = await db.execute(
        select(func.count(Job.id)).where(Job.user_id == user.id)
    )
    return int(result.scalar_one() or 0)


async def should_refresh_gap_insights(user: User, db: AsyncSession) -> bool:
    """
    Return True if we are at or past the refresh threshold (e.g. 10th or +10th job),
    so a background refresh should be scheduled.
    """
    total_jobs = await _count_user_jobs(db, user)
    if total_jobs < MIN_APPLICATIONS_FOR_INSIGHTS:
        return False
    last_count = getattr(user, "gap_insights_job_count", 0) or 0
    existing_insights = getattr(user, "gap_insights", None)
    if (
        isinstance(existing_insights, dict)
        and last_count >= MIN_APPLICATIONS_FOR_INSIGHTS
        and total_jobs < last_count + REFRESH_INTERVAL
    ):
        return False
    return True


async def _collect_gap_counts(db: AsyncSession, user: User) -> dict[str, int]:
    """Aggregate gap phrases across all of the user's jobs with fit_analysis.gaps."""
    result = await db.execute(
        select(Job, CV)
        .join(CV, Job.cv_id == CV.id)
        .where(Job.user_id == user.id)
    )
    rows = result.all()

    counter: Counter[str] = Counter()

    for job, cv in rows:
        fit_analysis = getattr(cv, "fit_analysis", None)
        if not isinstance(fit_analysis, dict):
            continue
        gaps = fit_analysis.get("gaps") or []
        if not isinstance(gaps, list):
            continue

        for gap in gaps:
            if not isinstance(gap, str):
                continue
            normalized = gap.strip()
            if not normalized:
                continue
            counter[normalized] += 1

    return dict(counter)


def _build_fallback_insights(gap_counts: dict[str, int]) -> dict[str, Any]:
    summary_text = (
        "We analysed your recent applications but could not generate a detailed "
        "AI summary right now."
        if gap_counts
        else "We could not detect any consistent gaps across your recent applications yet."
    )

    return {
        "summary_text": summary_text,
        "themes": [],
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


async def _generate_ai_gap_insights(
    gap_counts: dict[str, int],
) -> dict[str, Any]:
    if not gap_counts:
        return _build_fallback_insights(gap_counts)

    # Build a full list of gap sentences (no explicit counts) for the AI.
    # If a gap appears multiple times across applications, it will appear
    # multiple times in this list, giving the model a natural frequency signal.
    all_items = sorted(
        gap_counts.items(), key=lambda item: item[1], reverse=True
    )
    all_gaps: list[str] = []
    for gap, count in all_items:
        if count <= 0:
            continue
        all_gaps.extend([gap] * count)

    user_payload = {
        "gaps": all_gaps,
    }

    system_prompt = """
You are an expert career coach. You receive a JSON object with an array of ALL gap phrases
that appear when comparing a candidate's CV against job descriptions. Each phrase may appear
multiple times in the array if it shows up in multiple applications.

Your job is to:
- Identify 3–5 overarching themes that explain what the candidate tends to miss in applications.
- Write a concise, encouraging summary (2–4 sentences) that explains the recurring gaps.
- Provide 3–5 concrete, proactive recommendations that the candidate can focus on next.

Return ONLY a valid JSON object with this exact structure:
{
  "summary_text": "short narrative about recurring gaps and what they mean",
  "themes": [
    {
      "label": "short name for the theme",
      "description": "1–2 sentence explanation of this theme and why it matters",
      "count": 5
    }
  ]
}

Guidelines:
- Keep the tone practical, direct, and optimistic.
- Do not repeat the same sentence multiple times.
- Use the provided gap phrases as the primary evidence.
""".strip()

    user_prompt = json.dumps(user_payload, ensure_ascii=False)

    try:
        raw = await generate_completion(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            trace_name="gap_insights",
            metadata={"type": "gap_insights"},
            json_mode=True,
            temperature=0.7,
            max_tokens=4000,
        )
    except Exception:
        logger.exception("Failed to generate gap insights via AI, falling back.")
        return _build_fallback_insights(gap_counts)

    cleaned = raw.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        cleaned = "\n".join(lines[1:])
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3].strip()

    try:
        data = json.loads(cleaned)
    except Exception:
        logger.exception("Failed to parse AI gap insights JSON, falling back.")
        return _build_fallback_insights(gap_counts)

    if not isinstance(data, dict):
        return _build_fallback_insights(gap_counts)

    data.setdefault("summary_text", "")
    if not isinstance(data.get("summary_text"), str):
        data["summary_text"] = ""
    # Trust the model's themes but normalise shape lightly.
    themes = data.get("themes") or []
    if not isinstance(themes, list):
        themes = []
    normalised_themes: list[dict[str, Any]] = []
    for theme in themes:
        if not isinstance(theme, dict):
            continue
        label = theme.get("label")
        description = theme.get("description")
        count = theme.get("count")
        if not isinstance(label, str) or not isinstance(description, str):
            continue
        if not isinstance(count, int):
            count = 0
        normalised_themes.append(
            {"label": label, "description": description, "count": count}
        )
    data["themes"] = normalised_themes

    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    return data


async def build_gap_insights_for_user(
    user: User,
    db: AsyncSession,
) -> dict[str, Any]:
    """
    Compute or retrieve gap insights for a user.

    - Requires at least MIN_APPLICATIONS_FOR_INSIGHTS total jobs.
    - Stores insights on the User object and refreshes every REFRESH_INTERVAL jobs.
    """
    total_jobs = await _count_user_jobs(db, user)

    if total_jobs < MIN_APPLICATIONS_FOR_INSIGHTS:
        # Not enough data yet for any insights.
        return {
            "available": False,
            "total_applications": total_jobs,
            "next_refresh_at": MIN_APPLICATIONS_FOR_INSIGHTS,
            "gap_insights": None,
        }

    last_count = getattr(user, "gap_insights_job_count", 0) or 0
    existing_insights = getattr(user, "gap_insights", None)

    if (
        isinstance(existing_insights, dict)
        and last_count >= MIN_APPLICATIONS_FOR_INSIGHTS
        and total_jobs < last_count + REFRESH_INTERVAL
    ):
        # Use existing insights until we cross the next refresh threshold.
        return {
            "available": True,
            "total_applications": total_jobs,
            "next_refresh_at": last_count + REFRESH_INTERVAL,
            "gap_insights": existing_insights,
        }

    # Either we have no insights yet, or it's time to refresh.
    gap_counts = await _collect_gap_counts(db, user)
    insights = await _generate_ai_gap_insights(gap_counts)

    user.gap_insights = insights
    user.gap_insights_job_count = total_jobs
    await db.flush()

    return {
        "available": True,
        "total_applications": total_jobs,
        "next_refresh_at": total_jobs + REFRESH_INTERVAL,
        "gap_insights": insights,
    }


async def run_gap_insights_refresh(user_id: uuid.UUID) -> None:
    """
    Run gap insights build in a new DB session (for use after request ends).
    Commits on success; logs and rolls back on failure.
    """
    async with async_session() as session:
        try:
            result = await session.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()
            if not user:
                return
            await build_gap_insights_for_user(user=user, db=session)
            await session.commit()
        except Exception:
            logger.exception("Gap insights refresh failed for user_id=%s", user_id)
            await session.rollback()

