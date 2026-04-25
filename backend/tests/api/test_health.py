from __future__ import annotations

from httpx import AsyncClient


async def test_health_returns_ok(client: AsyncClient):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "service": "WadeCV API"}
