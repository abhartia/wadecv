"""Integration tests for /api/auth.

Hits a real Postgres via the session fixture. Each test is isolated inside a
nested transaction rolled back at teardown.
"""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_issues_tokens_and_creates_user(client: AsyncClient):
    r = await client.post(
        "/api/auth/register",
        json={"email": "new@example.com", "password": "correct-horse-battery-staple"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_rejects_duplicate_email(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "correct-horse-battery-staple"}
    first = await client.post("/api/auth/register", json=payload)
    assert first.status_code == 200
    second = await client.post("/api/auth/register", json=payload)
    assert second.status_code == 409


@pytest.mark.asyncio
async def test_register_rejects_invalid_email(client: AsyncClient):
    r = await client.post(
        "/api/auth/register",
        json={"email": "not-an-email", "password": "correct-horse-battery-staple"},
    )
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_me_requires_auth(client: AsyncClient):
    r = await client.get("/api/auth/me")
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_user_for_valid_token(client: AsyncClient, authed_user):
    user, token = authed_user
    r = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["id"] == str(user.id)
    assert body["email"] == user.email
    assert body["credits"] == 5


@pytest.mark.asyncio
async def test_login_rejects_wrong_password(client: AsyncClient, authed_user):
    user, _ = authed_user
    r = await client.post(
        "/api/auth/login",
        json={"email": user.email, "password": "wrong"},
    )
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_login_accepts_correct_password(client: AsyncClient, authed_user):
    user, _ = authed_user
    r = await client.post(
        "/api/auth/login",
        json={"email": user.email, "password": "correct-horse-battery-staple"},
    )
    assert r.status_code == 200
    assert r.json()["access_token"]


@pytest.mark.asyncio
async def test_response_includes_request_id_header(client: AsyncClient):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.headers.get("X-Request-ID"), "request id middleware should echo the header"


@pytest.mark.asyncio
async def test_request_id_echoes_incoming_value(client: AsyncClient):
    r = await client.get("/api/health", headers={"X-Request-ID": "client-supplied-id"})
    assert r.headers["X-Request-ID"] == "client-supplied-id"
