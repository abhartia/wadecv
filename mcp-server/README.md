# WadeCV SEO MCP Server

This folder contains a **Python MCP server** that connects to **Google Analytics 4 (GA4)** and **Google Search Console (GSC)** for the WadeCV app, and exposes tools that:

- Fetch **raw analytics/search summaries**.
- Generate **week-on-week SEO insights** grouped by the six programmatic content sections (jobs, company-resume, skills, resume-bullets, ats, career-change).
- Propose **structured content changes** (and optional code patch suggestions) aligned with the existing SEO plans and JSON content model.

The server is intended to be used from **Cursor via Model Context Protocol (MCP)** so you can run a weekly SEO workflow and let Cursor help apply changes to your content JSON files and React templates.

## Requirements

- Python 3.10+
- Service account JSON with access to:
  - GA4 Analytics Data API for your WadeCV property.
  - Google Search Console property for your WadeCV domain.

## Installation

From the repo root:

```bash
cd mcp-server
pip install -e .
```

This installs the dependencies declared in `pyproject.toml`, including:

- `mcp[cli]` – Python MCP SDK and CLI.
- `google-analytics-data` – GA4 Analytics Data API client.
- `google-api-python-client` / `google-auth` – Search Console + auth.
- `pydantic` – structured models for change proposals.

## Configuration

Set the following environment variables so the server knows which property/site to use and where to find credentials:

- `GOOGLE_APPLICATION_CREDENTIALS` – absolute path to your service account JSON.
- `GA4_PROPERTY_ID` – GA4 property ID for WadeCV (e.g. `123456789`).
- `GSC_SITE_URL` – Search Console site URL (e.g. `https://wadecv.com/`).
- `SEO_DEFAULT_LOOKBACK_DAYS` (optional, default `7`) – default lookback for some tools.

If `GOOGLE_APPLICATION_CREDENTIALS` is not set, the server will look for a JSON key in this folder (e.g. the existing `*.json` file).

## Running the server

From the `mcp-server` directory:

```bash
python server.py
```

The entrypoint is defined in `pyproject.toml` and compatible with MCP tooling (e.g. `mcp` CLI or Cursor MCP).

## MCP tools

The server exposes the following MCP primitives:

- **Resource `seo-config://wadecv`**
  - Returns a small JSON snapshot of the active GA4/GSC configuration (no secrets).

- **Tool `check_connection()`**
  - Runs a lightweight GA4 and GSC query to verify credentials and connectivity.

- **Tool `get_ga4_summary(start_days_ago=14, end_days_ago=0, limit=200)`**
  - Returns per-page GA4 metrics over a relative day range.

- **Tool `get_search_console_summary(lookback_days=28, row_limit=200)`**
  - Returns top pages and queries (clicks, impressions, CTR, position) from Search Console.

- **Tool `generate_weekly_seo_insights(lookback_weeks=1)`**
  - Compares the current week vs. the previous week using GA4 + GSC.
  - Groups insights and opportunities by the six SEO sections:
    - `jobs`, `company-resume`, `skills`, `resume-bullets`, `ats`, `career-change`.

- **Tool `propose_seo_changes(lookback_weeks=1, max_changes=10, include_code_patches=True)`**
  - Uses the weekly insights plus your existing JSON content files under `frontend/content/seo/` to:
    - Propose **content-level changes** (e.g. expand body, add FAQ/commonMistakes/relatedSlugs, add new entries).
    - Optionally attach **code patch suggestions** for React templates/components (e.g. FAQ section, related guides).
  - Returns a structured JSON batch of proposals that Cursor can turn into actual JSON or code edits.

## Using with Cursor (example)

In Cursor’s MCP configuration, add an entry similar to:

```json
{
  "name": "wadecv-seo",
  "command": ["python", "server.py"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "/absolute/path/to/your/service-account.json",
    "GA4_PROPERTY_ID": "123456789",
    "GSC_SITE_URL": "https://wadecv.com/"
  }
}
```

Once configured, you can:

1. Call `check_connection` to verify GA4/GSC access.
2. Call `generate_weekly_seo_insights` to understand what changed week-on-week.
3. Call `propose_seo_changes` to get concrete, structured suggestions that map directly onto:
   - `frontend/content/seo/jobs.json`
   - `frontend/content/seo/companies.json`
   - `frontend/content/seo/skills.json`
   - `frontend/content/seo/resume-bullets.json`
   - `frontend/content/seo/ats.json`
   - `frontend/content/seo/career-change.json`

From there, you (or Cursor automations) can apply the suggested JSON deltas and any safe code changes, keeping WadeCV’s SEO content strategy evolving week-on-week.
