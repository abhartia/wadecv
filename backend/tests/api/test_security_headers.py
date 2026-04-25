"""Verify the SecurityHeadersMiddleware is wired up.

We don't assert the exact value of every header (values are likely to
evolve as the threat model does); we assert the header is *present*, which
is the actual invariant a reviewer or scanner cares about.
"""

from __future__ import annotations

from httpx import AsyncClient


async def test_security_headers_present_on_success(client: AsyncClient):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.headers.get("X-Content-Type-Options") == "nosniff"
    assert r.headers.get("X-Frame-Options") == "DENY"
    assert r.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "Permissions-Policy" in r.headers
    assert "camera=()" in r.headers["Permissions-Policy"]
    assert r.headers.get("Cross-Origin-Opener-Policy") == "same-origin"
    assert r.headers.get("Cross-Origin-Resource-Policy") == "same-site"


async def test_hsts_disabled_in_development(client: AsyncClient):
    """conftest forces ENVIRONMENT=development — HSTS should be off locally
    so browsers don't pin http://localhost to HTTPS."""
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert "Strict-Transport-Security" not in r.headers


async def test_security_headers_present_on_error(client: AsyncClient):
    """Security headers must ride on error responses too — a 404 from an API
    is the one case where missing nosniff bites you (HTML sniffing on the
    JSON error body)."""
    r = await client.get("/api/this-route-does-not-exist")
    assert r.status_code == 404
    assert r.headers.get("X-Content-Type-Options") == "nosniff"
    assert r.headers.get("X-Frame-Options") == "DENY"
