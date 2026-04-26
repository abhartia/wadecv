"""Pull Google Search Console data for wadecv.com"""
import json, os
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
SA_PATH = os.path.join(os.path.dirname(__file__), "service-account.json")
SITE_URL = "sc-domain:wadecv.com"  # Try domain property first

creds = Credentials.from_service_account_file(SA_PATH, scopes=SCOPES)
service = build("searchconsole", "v1", credentials=creds)

today = datetime.now()
last_30_start = (today - timedelta(days=30)).strftime("%Y-%m-%d")
last_90_start = (today - timedelta(days=90)).strftime("%Y-%m-%d")
end_date = (today - timedelta(days=2)).strftime("%Y-%m-%d")  # GSC has 2-day lag

results = {}

# Try both domain property and URL prefix
for site in [SITE_URL, "https://wadecv.com/"]:
    try:
        print(f"Trying site: {site}")

        # 1. Top queries (last 30 days)
        resp = service.searchanalytics().query(
            siteUrl=site,
            body={
                "startDate": last_30_start,
                "endDate": end_date,
                "dimensions": ["query"],
                "rowLimit": 200,
                "dataState": "all"
            }
        ).execute()

        queries = []
        for row in resp.get("rows", []):
            queries.append({
                "query": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            })
        results["top_queries_30d"] = queries
        print(f"\n=== Top Queries (Last 30 Days) - {len(queries)} queries ===")
        for q in queries[:20]:
            print(f"  '{q['query']}': {q['clicks']} clicks, {q['impressions']} impr, CTR={q['ctr']}%, pos={q['position']}")

        # 2. Top pages
        resp = service.searchanalytics().query(
            siteUrl=site,
            body={
                "startDate": last_30_start,
                "endDate": end_date,
                "dimensions": ["page"],
                "rowLimit": 200,
                "dataState": "all"
            }
        ).execute()

        pages = []
        for row in resp.get("rows", []):
            pages.append({
                "page": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            })
        results["top_pages_30d"] = pages
        print(f"\n=== Top Pages (Last 30 Days) ===")
        for p in pages[:15]:
            print(f"  {p['page']}: {p['clicks']} clicks, {p['impressions']} impr, CTR={p['ctr']}%, pos={p['position']}")

        # 3. Query + page combined (to see which queries land on which pages)
        resp = service.searchanalytics().query(
            siteUrl=site,
            body={
                "startDate": last_30_start,
                "endDate": end_date,
                "dimensions": ["query", "page"],
                "rowLimit": 250,
                "dataState": "all"
            }
        ).execute()

        query_page = []
        for row in resp.get("rows", []):
            query_page.append({
                "query": row["keys"][0],
                "page": row["keys"][1],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            })
        results["query_page_30d"] = query_page

        # 4. Daily trend (last 90 days)
        resp = service.searchanalytics().query(
            siteUrl=site,
            body={
                "startDate": last_90_start,
                "endDate": end_date,
                "dimensions": ["date"],
                "rowLimit": 250,
                "dataState": "all"
            }
        ).execute()

        daily = []
        for row in resp.get("rows", []):
            daily.append({
                "date": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            })
        daily.sort(key=lambda x: x["date"])
        results["daily_trend_90d"] = daily
        print(f"\n=== Search Performance Daily (last 7 days) ===")
        for d in daily[-7:]:
            print(f"  {d['date']}: {d['clicks']} clicks, {d['impressions']} impr, pos={d['position']}")

        # 5. Device breakdown
        resp = service.searchanalytics().query(
            siteUrl=site,
            body={
                "startDate": last_30_start,
                "endDate": end_date,
                "dimensions": ["device"],
                "dataState": "all"
            }
        ).execute()

        devices = []
        for row in resp.get("rows", []):
            devices.append({
                "device": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            })
        results["devices_30d"] = devices
        print(f"\n=== Device Breakdown ===")
        for d in devices:
            print(f"  {d['device']}: {d['clicks']} clicks, {d['impressions']} impr, CTR={d['ctr']}%")

        # 6. Country breakdown
        resp = service.searchanalytics().query(
            siteUrl=site,
            body={
                "startDate": last_30_start,
                "endDate": end_date,
                "dimensions": ["country"],
                "rowLimit": 20,
                "dataState": "all"
            }
        ).execute()

        countries = []
        for row in resp.get("rows", []):
            countries.append({
                "country": row["keys"][0],
                "clicks": row["clicks"],
                "impressions": row["impressions"],
                "ctr": round(row["ctr"] * 100, 2),
                "position": round(row["position"], 1)
            })
        results["countries_30d"] = countries
        print(f"\n=== Top Countries ===")
        for c in countries[:10]:
            print(f"  {c['country']}: {c['clicks']} clicks, {c['impressions']} impr")

        # Success - save and break
        print(f"\nSuccessfully used site: {site}")
        break

    except Exception as e:
        print(f"  Failed: {e}")
        continue

with open(os.path.join(os.path.dirname(__file__), "gsc_data.json"), "w") as f:
    json.dump(results, f, indent=2)

print(f"\nFull data saved to gsc_data.json ({len(results)} datasets)")
