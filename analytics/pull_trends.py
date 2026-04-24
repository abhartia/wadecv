"""Pull Google Trends data for CV/resume related keywords.

Rate-limit resilient: exponential backoff + jitter, rotating user-agents, and
a long inter-group sleep. Google aggressively 429s pytrends on repeat calls
from the same IP/UA, so each group is built with a fresh TrendReq instance
and retried with backoff up to `MAX_RETRIES` times before moving on.
"""
import json
import os
import random
import time

# pytrends 4.9.x calls urllib3.util.retry.Retry(method_whitelist=...), which
# urllib3 2.0+ renamed to allowed_methods. Translate at the boundary so we don't
# need to pin urllib3<2 across the project.
from urllib3.util import retry as _urllib3_retry

_original_retry_init = _urllib3_retry.Retry.__init__


def _patched_retry_init(self, *args, **kwargs):
    if "method_whitelist" in kwargs and "allowed_methods" not in kwargs:
        kwargs["allowed_methods"] = kwargs.pop("method_whitelist")
    return _original_retry_init(self, *args, **kwargs)


_urllib3_retry.Retry.__init__ = _patched_retry_init

from pytrends.request import TrendReq

MAX_RETRIES = 5
INITIAL_BACKOFF_S = 8
INTER_GROUP_SLEEP_S = (12, 20)  # random uniform range

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
]


def fresh_client():
    ua = random.choice(USER_AGENTS)
    # pytrends accepts requests_args to pass through to the underlying session
    return TrendReq(
        hl="en-US",
        tz=360,
        retries=2,
        backoff_factor=0.5,
        requests_args={"headers": {"User-Agent": ua}},
    )


def with_backoff(fn, label):
    """Call `fn()`; on 429 / generic transient errors, back off and retry."""
    backoff = INITIAL_BACKOFF_S
    last_err = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return fn()
        except Exception as e:
            last_err = e
            msg = str(e).lower()
            is_429 = "429" in msg or "too many" in msg
            is_transient = is_429 or "timed out" in msg or "connection" in msg
            if not is_transient:
                raise
            sleep_s = backoff + random.uniform(0, backoff * 0.5)
            print(f"  {label} attempt {attempt} 429/transient — sleeping {sleep_s:.1f}s")
            time.sleep(sleep_s)
            backoff *= 2
    raise last_err


results = {}

keyword_groups = {
    "core_product": ["ai resume builder", "ai cv builder", "tailor resume to job", "resume tailoring tool", "ai cover letter"],
    "job_search": ["resume builder", "cv builder", "cover letter generator", "job application tool", "ats resume"],
    "competitors": ["resumeai", "kickresume", "novoresume", "teal resume", "jobscan"],
    "intent_signals": ["tailor cv for job", "customize resume", "resume for specific job", "ats friendly resume", "resume optimization"],
    "emerging": ["ai job application", "ai career tools", "gpt resume", "chatgpt resume", "ai job search"],
}

for group_name, keywords in keyword_groups.items():
    print(f"\n=== Trends: {group_name} ===")
    try:
        pytrends = fresh_client()

        def build_and_fetch_iot():
            pytrends.build_payload(keywords, cat=0, timeframe="today 12-m", geo="US")
            return pytrends.interest_over_time()

        iot = with_backoff(build_and_fetch_iot, f"{group_name}.iot")
        if iot is not None and not iot.empty:
            iot = iot.drop(columns=["isPartial"], errors="ignore")
            last_4w = iot.tail(4).mean().to_dict()
            overall = iot.mean().to_dict()
            trend = {}
            for kw in keywords:
                if kw in last_4w and kw in overall:
                    trend[kw] = {
                        "recent_avg": round(last_4w[kw], 1),
                        "overall_avg": round(overall[kw], 1),
                        "trend_direction": "up" if last_4w[kw] > overall[kw] * 1.1 else ("down" if last_4w[kw] < overall[kw] * 0.9 else "stable"),
                    }
                    print(f"  {kw}: recent={trend[kw]['recent_avg']}, avg={trend[kw]['overall_avg']}, trend={trend[kw]['trend_direction']}")
            results[f"{group_name}_trends"] = trend

            results[f"{group_name}_timeseries"] = {col: iot[col].tolist() for col in iot.columns}
            results[f"{group_name}_dates"] = [d.strftime("%Y-%m-%d") for d in iot.index]

        # Related queries (best-effort; don't let these block the next group)
        try:
            related = with_backoff(pytrends.related_queries, f"{group_name}.related")
            for kw in keywords[:2]:
                if kw in related and related[kw].get("rising") is not None:
                    rising = related[kw]["rising"].head(10).to_dict("records")
                    results[f"rising_queries_{kw}"] = rising
                    print(f"  Rising queries for '{kw}':")
                    for r in rising[:5]:
                        print(f"    {r['query']}: {r['value']}%")
                if kw in related and related[kw].get("top") is not None:
                    top = related[kw]["top"].head(10).to_dict("records")
                    results[f"top_queries_{kw}"] = top
        except Exception as e:
            print(f"  Related queries failed: {e}")

    except Exception as e:
        print(f"  Error ({group_name}): {e}")

    # Sleep between groups so Google sees spaced traffic, not a burst
    pause = random.uniform(*INTER_GROUP_SLEEP_S)
    print(f"  (pausing {pause:.1f}s before next group)")
    time.sleep(pause)

# Geographic interest
print("\n=== Geographic Interest: 'ai resume builder' ===")
try:
    pytrends = fresh_client()

    def geo_fetch():
        pytrends.build_payload(["ai resume builder"], timeframe="today 3-m", geo="US")
        return pytrends.interest_by_region(resolution="REGION", inc_low_vol=False)

    by_region = with_backoff(geo_fetch, "geo")
    top_states = by_region[by_region["ai resume builder"] > 0].sort_values("ai resume builder", ascending=False).head(15)
    states = top_states.to_dict()["ai resume builder"]
    results["geo_interest_us"] = states
    print(f"  Top states: {list(states.items())[:5]}")
except Exception as e:
    print(f"  Geo error: {e}")

with open(os.path.join(os.path.dirname(__file__), "trends_data.json"), "w") as f:
    json.dump(results, f, indent=2, default=str)

print("\nFull trends data saved to trends_data.json")
