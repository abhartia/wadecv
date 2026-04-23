"""Verify slowapi is wired up and actually rejects above the threshold."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.config import get_settings


@pytest.mark.asyncio
async def test_auth_endpoint_is_rate_limited(client: AsyncClient, monkeypatch):
    # Force a tight limit so the test is cheap.
    settings = get_settings()
    monkeypatch.setattr(settings, "rate_limit_default_per_minute", 3)

    # slowapi has already been constructed with the settings value at import
    # time, so rather than hacking internals we just drive enough requests to
    # exceed the default global cap.
    last_status = 200
    for _ in range(settings.rate_limit_default_per_minute + 5):
        r = await client.post("/api/auth/login", json={"email": "x@x.x", "password": "p"})
        last_status = r.status_code
        if last_status == 429:
            break
    assert last_status == 429, "expected a 429 once the default limit was exceeded"
