from __future__ import annotations

from typing import Any, Dict, List, Optional


def _parse_year_month(value: Optional[str]) -> Optional[int]:
    """
    Parse dates like YYYY-MM or YYYY into a comparable month index.

    Returns an integer representing year * 12 + month, or None if parsing fails.
    """
    if not value:
        return None
    trimmed = value.strip()
    if not trimmed:
        return None
    lower = trimmed.lower()
    if "present" in lower:
        # Treat \"Present\" specially; callers should translate to a concrete
        # month index based on \"now\" if needed. Here we just return None so
        # the caller can handle it separately.
        return None
    parts = trimmed.split("-")
    if not parts:
        return None
    try:
        year = int(parts[0])
    except ValueError:
        return None
    month = 1
    if len(parts) > 1:
        try:
            month = int(parts[1])
        except ValueError:
            month = 1
    return year * 12 + month


def compact_experience_bullets_for_one_page(
    cv_data: Dict[str, Any],
    *,
    recent_roles: int = 2,
    max_recent_bullets: int = 3,
    max_older_bullets: int = 2,
) -> Dict[str, Any]:
    """
    Deterministically trim experience bullets to help a 1-page CV fit.

    Strategy:
    - Sort roles by recency using end_date/start_date.
    - Keep the `recent_roles` most recent roles with up to `max_recent_bullets` bullets.
    - For all older roles, clamp bullets to `max_older_bullets`.
    - Do not remove roles, education, skills, or other sections.
    """
    experience = cv_data.get("experience") or []
    if not isinstance(experience, list) or not experience:
        return cv_data

    indexed: List[Dict[str, Any]] = []
    for idx, exp in enumerate(experience):
        if not isinstance(exp, dict):
            continue
        end = exp.get("end_date") or ""
        start = exp.get("start_date") or ""
        # Treat explicit \"Present\" as most recent.
        score: float
        if isinstance(end, str) and "present" in end.lower():
            score = float("inf")
        else:
            parsed_end = _parse_year_month(end)
            parsed_start = _parse_year_month(start)
            if parsed_end is not None:
                score = float(parsed_end)
            elif parsed_start is not None:
                score = float(parsed_start)
            else:
                score = float(idx)
        indexed.append({"index": idx, "exp": exp, "score": score})

    # Newest first
    indexed.sort(key=lambda item: item["score"], reverse=True)

    for rank, item in enumerate(indexed):
        exp_dict = item["exp"]
        bullets = exp_dict.get("bullets") or []
        if not isinstance(bullets, list):
            continue
        if rank < recent_roles:
            limit = max_recent_bullets
        else:
            limit = max_older_bullets
        if limit >= 0 and len(bullets) > limit:
            exp_dict["bullets"] = bullets[:limit]

    return cv_data

