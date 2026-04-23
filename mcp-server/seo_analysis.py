from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Literal, Optional, Sequence, Tuple

from google_clients import AnalyticsClient, SearchConsoleClient, SeoConfig, default_date_ranges_for_weeks


SeoContentType = Literal["jobs", "company-resume", "skills", "resume-bullets", "ats", "career-change"]


@dataclass
class PageMetrics:
    path: str
    sessions: float
    pageviews: float
    users: float
    engaged_sessions: float


@dataclass
class QueryMetrics:
    query: str
    page: Optional[str]
    clicks: float
    impressions: float
    ctr: float
    position: float


def load_existing_seo_slugs(repo_root: Path) -> Dict[SeoContentType, List[str]]:
    """
    Load known slugs for the six SEO content sections from the JSON files,
    if they exist. This lets us map Search Console URLs/queries back to
    your content model.
    """
    base = repo_root / "frontend" / "content" / "seo"

    mapping: Dict[SeoContentType, List[str]] = {
        "jobs": [],
        "company-resume": [],
        "skills": [],
        "resume-bullets": [],
        "ats": [],
        "career-change": [],
    }

    file_map = {
        "jobs": "jobs.json",
        "company-resume": "companies.json",
        "skills": "skills.json",
        "resume-bullets": "resume-bullets.json",
        "ats": "ats.json",
        "career-change": "career-change.json",
    }

    for content_type, filename in file_map.items():
        path = base / filename
        if not path.is_file():
            continue
        try:
            with path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            continue

        slugs: List[str] = []
        for entry in data:
            slug = entry.get("slug") or entry.get("name")
            if isinstance(slug, str):
                slugs.append(slug)
        mapping[content_type] = slugs  # type: ignore[assignment]

    return mapping


def classify_url_to_content_type(path: str) -> Optional[Tuple[SeoContentType, str]]:
    """
    Infer (content_type, slug) from a URL path, based on the route scheme from the SEO plans.
    Examples:
      /jobs/software-engineer           -> ("jobs", "software-engineer")
      /company-resume/google            -> ("company-resume", "google")
      /skills/nurse                     -> ("skills", "nurse")
      /resume-bullets/software-engineer -> ("resume-bullets", "software-engineer")
      /ats/greenhouse                   -> ("ats", "greenhouse")
      /career-change/teacher-to-tech    -> ("career-change", "teacher-to-tech")
    """
    segments = [seg for seg in path.split("/") if seg]
    if not segments:
        return None

    section = segments[0]
    slug = segments[1] if len(segments) > 1 else ""

    mapping: Dict[str, SeoContentType] = {
        "jobs": "jobs",
        "company-resume": "company-resume",
        "skills": "skills",
        "resume-bullets": "resume-bullets",
        "ats": "ats",
        "career-change": "career-change",
    }
    content_type = mapping.get(section)
    if not content_type or not slug:
        return None
    return content_type, slug


def classify_query_to_content_type(query: str) -> Optional[SeoContentType]:
    """
    Heuristic to guess which content section a new query should map to if
    there is no existing landing page:
      - Contains 'resume bullets', 'bullet points' -> resume-bullets
      - Contains 'skills' or 'skill for'          -> skills
      - Contains 'ats' or a known ATS brand       -> ats
      - Contains 'career change' / 'transition'   -> career-change
      - Contains 'resume for <company>'           -> company-resume
      - Fallback: jobs
    """
    q = query.lower()
    if "bullet" in q:
        return "resume-bullets"
    if "skill" in q:
        return "skills"
    if "ats" in q or any(brand in q for brand in ["greenhouse", "lever", "ashby", "workday", "taleo", "icims"]):
        return "ats"
    if "career change" in q or "transition" in q:
        return "career-change"
    if "resume for" in q or "cv for" in q:
        return "company-resume"
    return "jobs"


def build_weekly_insights(
    config: SeoConfig,
    ga_client: AnalyticsClient,
    sc_client: SearchConsoleClient,
    lookback_weeks: int,
    repo_root: Optional[Path] = None,
) -> Dict[str, Any]:
    """
    Generate structured week-on-week SEO insights across GA4 and Search Console.

    Returns a dict shaped like:
      {
        "summary": "...",
        "key_wins": [...],
        "key_losses": [...],
        "opportunities": {
          "jobs": [...],
          "company-resume": [...],
          ...
        }
      }
    """
    if repo_root is None:
        # Assume repo root is the parent of the mcp-server directory.
        repo_root = Path(__file__).resolve().parents[1]

    existing_slugs = load_existing_seo_slugs(repo_root)

    (start_cur, end_cur), (start_prev, end_prev) = default_date_ranges_for_weeks(lookback_weeks)

    ga_current = ga_client.fetch_page_metrics(start_cur, end_cur)
    ga_prev = ga_client.fetch_page_metrics(start_prev, end_prev)

    gsc_pages_current = sc_client.fetch_search_analytics(start_cur, end_cur, dimensions=("page",))
    gsc_pages_prev = sc_client.fetch_search_analytics(start_prev, end_prev, dimensions=("page",))
    gsc_queries_current = sc_client.fetch_search_analytics(start_cur, end_cur, dimensions=("query", "page"))

    # Index GA data by pagePath.
    def index_by_key(rows: List[Dict[str, Any]], key: str) -> Dict[str, Dict[str, Any]]:
        indexed: Dict[str, Dict[str, Any]] = {}
        for r in rows:
            k = r.get(key)
            if isinstance(k, str):
                indexed[k] = r
        return indexed

    ga_cur_by_path = index_by_key(ga_current, "pagePath")
    ga_prev_by_path = index_by_key(ga_prev, "pagePath")

    gsc_cur_by_page = index_by_key(gsc_pages_current, "page")
    gsc_prev_by_page = index_by_key(gsc_pages_prev, "page")

    # Build combined per-page metrics where possible.
    per_page: Dict[str, Dict[str, Any]] = {}
    for path, cur in ga_cur_by_path.items():
        prev = ga_prev_by_path.get(path, {})
        gsc_cur = gsc_cur_by_page.get(path, {})
        gsc_prev = gsc_prev_by_page.get(path, {})

        sessions_cur = float(cur.get("sessions", 0.0))
        sessions_prev = float(prev.get("sessions", 0.0))
        clicks_cur = float(gsc_cur.get("clicks", 0.0))
        clicks_prev = float(gsc_prev.get("clicks", 0.0))
        impressions_cur = float(gsc_cur.get("impressions", 0.0))
        ctr_cur = float(gsc_cur.get("ctr", 0.0))

        per_page[path] = {
            "path": path,
            "sessions_current": sessions_cur,
            "sessions_previous": sessions_prev,
            "sessions_change": sessions_cur - sessions_prev,
            "sessions_change_pct": (sessions_cur - sessions_prev) / sessions_prev * 100.0 if sessions_prev > 0 else None,
            "clicks_current": clicks_cur,
            "clicks_previous": clicks_prev,
            "clicks_change": clicks_cur - clicks_prev,
            "clicks_change_pct": (clicks_cur - clicks_prev) / clicks_prev * 100.0 if clicks_prev > 0 else None,
            "impressions_current": impressions_cur,
            "ctr_current": ctr_cur,
        }

    key_wins: List[Dict[str, Any]] = []
    key_losses: List[Dict[str, Any]] = []
    opportunities: Dict[SeoContentType, List[Dict[str, Any]]] = {
        "jobs": [],
        "company-resume": [],
        "skills": [],
        "resume-bullets": [],
        "ats": [],
        "career-change": [],
    }

    # Identify wins and losses based on changes.
    for path, metrics in per_page.items():
        change_pct = metrics.get("clicks_change_pct")
        if change_pct is None:
            continue

        classification = classify_url_to_content_type(path)
        if not classification:
            continue
        content_type, slug = classification

        item = {
            "path": path,
            "content_type": content_type,
            "slug": slug,
            "clicks_current": metrics["clicks_current"],
            "clicks_previous": metrics["clicks_previous"],
            "clicks_change_pct": change_pct,
            "impressions_current": metrics["impressions_current"],
            "ctr_current": metrics["ctr_current"],
        }

        if change_pct >= 25.0 and metrics["clicks_current"] >= 5:
            key_wins.append(item)
        elif change_pct <= -25.0 and metrics["clicks_previous"] >= 5:
            key_losses.append(item)

        # High impressions, low CTR opportunities.
        impressions = metrics["impressions_current"]
        ctr = metrics["ctr_current"]
        if impressions >= 50 and ctr < 0.03:
            opportunities[content_type].append(
                {
                    "kind": "low_ctr_page",
                    "path": path,
                    "slug": slug,
                    "impressions": impressions,
                    "ctr": ctr,
                    "suggestion": "Improve title/meta description and on-page copy to better match high-intent queries.",
                }
            )

    # Query-level gaps: queries with impressions but weak or missing landing pages.
    for row in gsc_queries_current:
        query = str(row.get("query") or "")
        page = str(row.get("page") or "")
        impressions = float(row.get("impressions", 0.0))
        clicks = float(row.get("clicks", 0.0))
        ctr = float(row.get("ctr", 0.0))

        if impressions < 30:
            continue

        classification = classify_url_to_content_type(page) if page else None
        if classification:
            content_type, slug = classification
        else:
            content_type = classify_query_to_content_type(query) or "jobs"
            slug = ""

        if clicks == 0 or ctr < 0.02:
            opportunities[content_type].append(
                {
                    "kind": "query_gap_or_weak_landing",
                    "query": query,
                    "landing_page": page or None,
                    "slug": slug or None,
                    "impressions": impressions,
                    "ctr": ctr,
                    "suggestion": "Strengthen or create a page that targets this query with focused copy, FAQs, and common mistakes.",
                }
            )

    summary = (
        f"Compared {start_cur.isoformat()}–{end_cur.isoformat()} against "
        f"{start_prev.isoformat()}–{end_prev.isoformat()} using GA4 and Search Console for {config.gsc_site_url}."
    )

    return {
        "summary": summary,
        "key_wins": sorted(key_wins, key=lambda r: r["clicks_change_pct"] or 0.0, reverse=True)[:20],
        "key_losses": sorted(key_losses, key=lambda r: r["clicks_change_pct"] or 0.0)[:20],
        "opportunities": opportunities,
    }


def build_seo_change_proposals(
    insights: Dict[str, Any],
    existing_slugs: Optional[Dict[SeoContentType, List[str]]] = None,
    max_changes: int = 10,
) -> List[Dict[str, Any]]:
    """
    Turn raw insights into structured change proposals aligned with the
    JSON content model from the SEO plans.

    Output shape (per proposal):
      {
        "content_type": "jobs" | ...,
        "slug": "software-engineer" | null (for new),
        "change_kind": "...",
        "proposed_entry_delta": {...},
        "priority": "high" | "medium" | "low",
        "rationale": "..."
      }
    """
    if existing_slugs is None:
        existing_slugs = {
            "jobs": [],
            "company-resume": [],
            "skills": [],
            "resume-bullets": [],
            "ats": [],
            "career-change": [],
        }

    proposals: List[Dict[str, Any]] = []

    # 1) Low CTR pages: propose improving meta + body depth and FAQs.
    for content_type, opps in insights.get("opportunities", {}).items():
        ctype: SeoContentType = content_type  # type: ignore[assignment]
        for opp in opps:
            if opp.get("kind") != "low_ctr_page":
                continue
            slug = opp.get("slug")
            if not slug:
                continue
            proposals.append(
                {
                    "content_type": ctype,
                    "slug": slug,
                    "change_kind": "expand_body_and_faq",
                    "proposed_entry_delta": {
                        # We do not generate final copy here, but describe the intended structure.
                        "body": "<expand to 400–700 words focusing on user intent from top queries>",
                        "faq": [
                            {"question": "<common question from search queries>", "answer": "<helpful answer>"},
                        ],
                        "commonMistakes": [
                            "<pitfall to avoid on the resume for this topic>",
                        ],
                    },
                    "priority": "high",
                    "rationale": (
                        "High impressions and low CTR suggest the snippet and on-page content are not matching "
                        "searcher intent. Deepen the body and add FAQs and common mistakes per the SEO content plan."
                    ),
                }
            )

    # 2) Query gaps or weak landings: propose new entries or cross-links.
    for content_type, opps in insights.get("opportunities", {}).items():
        ctype = content_type  # type: ignore[assignment]
        for opp in opps:
            if opp.get("kind") != "query_gap_or_weak_landing":
                continue

            query = str(opp.get("query") or "")
            slug = opp.get("slug") or ""
            impressions = float(opp.get("impressions", 0.0))

            if slug and slug in (existing_slugs.get(ctype, []) or []):
                # Strengthen existing page for this query.
                proposals.append(
                    {
                        "content_type": ctype,
                        "slug": slug,
                        "change_kind": "target_additional_query",
                        "proposed_entry_delta": {
                            "body": "<add a dedicated paragraph addressing this query explicitly>",
                            "faq": [
                                {"question": query, "answer": "<direct, concise answer>"},
                            ],
                        },
                        "priority": "medium",
                        "rationale": (
                            f"Query '{query}' has {impressions:.0f} impressions but low engagement; strengthen the "
                            "existing page with content that explicitly addresses this query."
                        ),
                    }
                )
            else:
                # Propose a new entry in the appropriate content file.
                safe_slug = query.lower().replace(" ", "-").replace("/", "-")
                proposals.append(
                    {
                        "content_type": ctype,
                        "slug": safe_slug,
                        "change_kind": "add_entry",
                        "proposed_entry_delta": {
                            "slug": safe_slug,
                            "title": query.capitalize(),
                            "metaDescription": f"How to optimize your resume for '{query}'.",
                            "intro": "<2–4 sentence intro framing the topic and why it matters>",
                            "body": "<400–700 word guide following the SEO content depth plan>",
                            # Additional fields (tips, bulletExamples, etc.) will depend on content_type and
                            # can be filled in by Cursor using this scaffold.
                        },
                        "priority": "medium" if impressions < 100 else "high",
                        "rationale": (
                            f"Query '{query}' has {impressions:.0f} impressions but no strong dedicated landing page. "
                            "Adding a new entry in this section aligns with the programmatic SEO strategy."
                        ),
                    }
                )

    # Cap total proposals.
    proposals = proposals[:max_changes]
    return proposals


__all__ = [
    "SeoContentType",
    "PageMetrics",
    "QueryMetrics",
    "load_existing_seo_slugs",
    "classify_url_to_content_type",
    "classify_query_to_content_type",
    "build_weekly_insights",
    "build_seo_change_proposals",
]
