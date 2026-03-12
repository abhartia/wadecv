from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import date
from typing import Any, Dict, List, Literal, Optional, Sequence, Tuple

from dateutil.relativedelta import relativedelta
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from googleapiclient.discovery import build


GA4_SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
GSC_SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]


@dataclass
class SeoConfig:
    """Configuration for connecting to GA4 and Search Console for WadeCV."""

    ga4_property_id: str
    gsc_site_url: str
    default_lookback_days: int = 7


def _load_service_account_credentials() -> service_account.Credentials:
    """
    Load service account JSON credentials.

    Prefers GOOGLE_APPLICATION_CREDENTIALS, otherwise falls back to the JSON
    key in the local mcp-server directory (if present).
    """
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not key_path:
        # Fallback to a JSON file in the current directory
        here = os.path.dirname(os.path.abspath(__file__))
        # Use the existing key in the mcp-server folder if present.
        candidates = [
            os.path.join(here, "service-account.json"),
        ]
        # Also consider any single .json in this folder if not explicitly named.
        for name in os.listdir(here):
            if name.endswith(".json"):
                candidates.append(os.path.join(here, name))

        for candidate in candidates:
            if os.path.isfile(candidate):
                key_path = candidate
                break

    if not key_path or not os.path.isfile(key_path):
        raise FileNotFoundError(
            "Service account JSON not found. Set GOOGLE_APPLICATION_CREDENTIALS "
            "or place the key in the mcp-server directory."
        )

    with open(key_path, "r", encoding="utf-8") as f:
        info = json.load(f)

    credentials = service_account.Credentials.from_service_account_info(info)
    if credentials.requires_scopes:
        credentials = credentials.with_scopes(list(set(GA4_SCOPES + GSC_SCOPES)))

    # Refresh to ensure we have a valid access token when needed.
    credentials.refresh(Request())
    return credentials


def load_seo_config() -> SeoConfig:
    """Load GA4 property ID and Search Console site URL from environment."""
    ga4_property_id = os.getenv("GA4_PROPERTY_ID")
    gsc_site_url = os.getenv("GSC_SITE_URL")

    if not ga4_property_id:
        raise RuntimeError("GA4_PROPERTY_ID environment variable is required.")
    if not gsc_site_url:
        raise RuntimeError("GSC_SITE_URL environment variable is required.")

    default_lookback = int(os.getenv("SEO_DEFAULT_LOOKBACK_DAYS", "7"))
    return SeoConfig(
        ga4_property_id=ga4_property_id,
        gsc_site_url=gsc_site_url,
        default_lookback_days=default_lookback,
    )


class AnalyticsClient:
    """Thin wrapper around the GA4 Analytics Data API client."""

    def __init__(self, config: SeoConfig, credentials: Optional[service_account.Credentials] = None) -> None:
        self.config = config
        self.credentials = credentials or _load_service_account_credentials().with_scopes(GA4_SCOPES)
        self._client = BetaAnalyticsDataClient(credentials=self.credentials)

    def fetch_page_metrics(
        self,
        start_date: date,
        end_date: date,
        limit: int = 200,
    ) -> List[Dict[str, Any]]:
        """
        Fetch basic per-page metrics for the given date range.

        Returns a list of dicts keyed by dimension/metric name.
        """
        request = RunReportRequest(
            property=f"properties/{self.config.ga4_property_id}",
            dimensions=[Dimension(name="pagePath")],
            metrics=[
                Metric(name="screenPageViews"),
                Metric(name="sessions"),
                Metric(name="totalUsers"),
                Metric(name="engagedSessions"),
            ],
            date_ranges=[
                DateRange(
                    start_date=start_date.isoformat(),
                    end_date=end_date.isoformat(),
                )
            ],
            limit=limit,
        )
        response = self._client.run_report(request)

        results: List[Dict[str, Any]] = []
        for row in response.rows:
            record: Dict[str, Any] = {}
            for dim_header, dim_value in zip(response.dimension_headers, row.dimension_values):
                record[dim_header.name] = dim_value.value
            for met_header, met_value in zip(response.metric_headers, row.metric_values):
                # GA4 metrics are strings; cast to float where possible.
                try:
                    record[met_header.name] = float(met_value.value)
                except (TypeError, ValueError):
                    record[met_header.name] = met_value.value
            results.append(record)
        return results


class SearchConsoleClient:
    """Thin wrapper around the Google Search Console API client."""

    def __init__(self, config: SeoConfig, credentials: Optional[service_account.Credentials] = None) -> None:
        self.config = config
        self.credentials = credentials or _load_service_account_credentials().with_scopes(GSC_SCOPES)
        # API name can be "webmasters" (v3) or "searchconsole" (v1); use searchconsole where supported.
        try:
            self._service = build("searchconsole", "v1", credentials=self.credentials, cache_discovery=False)
        except Exception:
            # Fallback to legacy name if needed.
            self._service = build("webmasters", "v3", credentials=self.credentials, cache_discovery=False)

    def fetch_search_analytics(
        self,
        start_date: date,
        end_date: date,
        dimensions: Sequence[Literal["page", "query"]] = ("page",),
        row_limit: int = 250,
    ) -> List[Dict[str, Any]]:
        """
        Fetch Search Console search analytics rows for the configured property.

        Dimensions can include "page" and/or "query".
        """
        dimension_filters: List[Dict[str, Any]] = []

        body: Dict[str, Any] = {
            "startDate": start_date.isoformat(),
            "endDate": end_date.isoformat(),
            "dimensions": list(dimensions),
            "rowLimit": row_limit,
        }

        request = (
            self._service.searchanalytics()
            .query(siteUrl=self.config.gsc_site_url, body=body)  # type: ignore[call-arg]
        )
        response = request.execute()

        rows = response.get("rows", [])
        results: List[Dict[str, Any]] = []
        for row in rows:
            keys = row.get("keys", [])
            record: Dict[str, Any] = {}
            for idx, dim in enumerate(dimensions):
                if idx < len(keys):
                    record[dim] = keys[idx]
            record["clicks"] = float(row.get("clicks", 0.0))
            record["impressions"] = float(row.get("impressions", 0.0))
            record["ctr"] = float(row.get("ctr", 0.0))
            record["position"] = float(row.get("position", 0.0))
            results.append(record)
        return results


def default_date_ranges_for_weeks(weeks_back: int = 1) -> Tuple[Tuple[date, date], Tuple[date, date]]:
    """
    Return (current_week_start, current_week_end), (previous_week_start, previous_week_end).

    weeks_back=1 means "this week vs previous week"; 2 means "N weeks ago vs (N+1) weeks ago", etc.
    """
    today = date.today()
    # Define weeks as 7-day windows ending yesterday.
    end_current = today - relativedelta(days=1 + (weeks_back - 1) * 7)
    start_current = end_current - relativedelta(days=6)
    end_prev = start_current - relativedelta(days=1)
    start_prev = end_prev - relativedelta(days=6)
    return (start_current, end_current), (start_prev, end_prev)


__all__ = [
    "SeoConfig",
    "load_seo_config",
    "AnalyticsClient",
    "SearchConsoleClient",
    "default_date_ranges_for_weeks",
]

