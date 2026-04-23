from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from mcp.server.fastmcp import FastMCP

from google_clients import (
    AnalyticsClient,
    SearchConsoleClient,
    SeoConfig,
    default_date_ranges_for_weeks,
    load_seo_config,
)
from patch_models import EntryDelta, SeoChangeBatch, SeoChangeProposal
from seo_analysis import (
    build_seo_change_proposals,
    build_weekly_insights,
    load_existing_seo_slugs,
)


mcp = FastMCP("wadecv-seo")


def _get_repo_root() -> Path:
    # Assume repo root is the parent of the mcp-server directory.
    return Path(__file__).resolve().parents[1]


def _init_clients() -> Dict[str, Any]:
    config = load_seo_config()
    analytics = AnalyticsClient(config=config)
    search_console = SearchConsoleClient(config=config)
    return {"config": config, "analytics": analytics, "search_console": search_console}


_clients_cache: Optional[Dict[str, Any]] = None


def _clients() -> Dict[str, Any]:
    global _clients_cache
    if _clients_cache is None:
        _clients_cache = _init_clients()
    return _clients_cache


@mcp.resource("seo-config://wadecv")
def get_seo_config() -> Dict[str, Any]:
    """
    Return a snapshot of the MCP SEO configuration (no secrets).
    """
    cfg = _clients()["config"]
    assert isinstance(cfg, SeoConfig)
    return {
        "ga4_property_id": cfg.ga4_property_id,
        "gsc_site_url": cfg.gsc_site_url,
        "default_lookback_days": cfg.default_lookback_days,
    }


@mcp.tool()
def check_connection() -> Dict[str, Any]:
    """
    Check connectivity to GA4 and Google Search Console.
    """
    out: Dict[str, Any] = {"ga4": {}, "search_console": {}}
    clients = _clients()
    cfg: SeoConfig = clients["config"]
    analytics: AnalyticsClient = clients["analytics"]
    search_console: SearchConsoleClient = clients["search_console"]

    (start, end), _ = default_date_ranges_for_weeks(1)

    # GA4 check
    try:
        rows = analytics.fetch_page_metrics(start, end, limit=5)
        out["ga4"] = {
            "status": "ok",
            "sample_rows": rows,
        }
    except Exception as exc:  # noqa: BLE001
        out["ga4"] = {"status": "error", "error": str(exc)}

    # GSC check
    try:
        rows = search_console.fetch_search_analytics(start, end, dimensions=("page",), row_limit=5)
        out["search_console"] = {
            "status": "ok",
            "sample_rows": rows,
        }
    except Exception as exc:  # noqa: BLE001
        out["search_console"] = {"status": "error", "error": str(exc)}

    return out


@mcp.tool()
def get_ga4_summary(start_days_ago: int = 14, end_days_ago: int = 0, limit: int = 200) -> Dict[str, Any]:
    """
    Fetch a basic GA4 per-page summary for a relative day range.

    start_days_ago=14, end_days_ago=0 -> last 14 days including yesterday.
    """
    from datetime import date, timedelta

    clients = _clients()
    analytics: AnalyticsClient = clients["analytics"]

    today = date.today()
    end = today - timedelta(days=end_days_ago + 1)
    start = today - timedelta(days=start_days_ago + 1)

    rows = analytics.fetch_page_metrics(start, end, limit=limit)
    return {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "rows": rows,
    }


@mcp.tool()
def get_search_console_summary(lookback_days: int = 28, row_limit: int = 200) -> Dict[str, Any]:
    """
    Fetch a basic Search Console summary of top pages and queries.
    """
    from datetime import date, timedelta

    clients = _clients()
    search_console: SearchConsoleClient = clients["search_console"]

    today = date.today()
    end = today - timedelta(days=1)
    start = end - timedelta(days=lookback_days - 1)

    pages = search_console.fetch_search_analytics(start, end, dimensions=("page",), row_limit=row_limit)
    queries = search_console.fetch_search_analytics(start, end, dimensions=("query", "page"), row_limit=row_limit)

    return {
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "pages": pages,
        "queries": queries,
    }


@mcp.tool()
def generate_weekly_seo_insights(lookback_weeks: int = 1) -> Dict[str, Any]:
    """
    Generate structured week-on-week SEO insights across GA4 and GSC, grouped
    by the six programmatic SEO sections.
    """
    clients = _clients()
    cfg: SeoConfig = clients["config"]
    analytics: AnalyticsClient = clients["analytics"]
    search_console: SearchConsoleClient = clients["search_console"]

    insights = build_weekly_insights(
        config=cfg,
        ga_client=analytics,
        sc_client=search_console,
        lookback_weeks=lookback_weeks,
        repo_root=_get_repo_root(),
    )
    return insights


@mcp.tool()
def propose_seo_changes(lookback_weeks: int = 1, max_changes: int = 10, include_code_patches: bool = True) -> Dict[str, Any]:
    """
    Propose structured SEO content and (optionally) code changes based on
    week-on-week analytics.
    """
    clients = _clients()
    cfg: SeoConfig = clients["config"]
    analytics: AnalyticsClient = clients["analytics"]
    search_console: SearchConsoleClient = clients["search_console"]

    repo_root = _get_repo_root()
    existing_slugs = load_existing_seo_slugs(repo_root)

    insights = build_weekly_insights(
        config=cfg,
        ga_client=analytics,
        sc_client=search_console,
        lookback_weeks=lookback_weeks,
        repo_root=repo_root,
    )
    raw_proposals = build_seo_change_proposals(
        insights=insights,
        existing_slugs=existing_slugs,
        max_changes=max_changes,
    )

    # Wrap raw dict proposals into Pydantic models for better typing/validation.
    proposals: List[SeoChangeProposal] = []
    for p in raw_proposals:
        delta = EntryDelta(**(p.get("proposed_entry_delta") or {}))
        proposals.append(
            SeoChangeProposal(
                content_type=p["content_type"],
                slug=p.get("slug"),
                change_kind=p["change_kind"],
                proposed_entry_delta=delta,
                priority=p.get("priority", "medium"),
                rationale=p.get("rationale", ""),
            )
        )

    batch = SeoChangeBatch(changes=proposals, code_patches=None)
    return batch.model_dump()


def main() -> None:
    """
    Entry point when run as a standalone MCP server.
    """
    mcp.run()


if __name__ == "__main__":
    main()
