"""Smoke test that slowapi middleware is wired up.

A full trip to 429 would require forcing a tight per-test limit, but the limiter
is constructed once from settings at import time — there's no clean override.
Instead we verify the standard RateLimit-* response headers are attached, which
only happens if the middleware actually ran end-to-end.
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_rate_limit_headers_are_present(client: AsyncClient):
    r = await client.get("/api/health")
    assert r.status_code == 200
    # slowapi (with headers_enabled=True) sets these on every response.
    assert "X-RateLimit-Limit" in r.headers
    assert "X-RateLimit-Remaining" in r.headers
