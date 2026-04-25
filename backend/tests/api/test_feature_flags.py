"""Integration tests for the feature flag system.

Exercises the DB model, the /api/feature-flags/{name} endpoint, and the
hash-based rollout logic.
"""

from __future__ import annotations

from httpx import AsyncClient

from app.models.feature_flag import FeatureFlag
from app.services.feature_flags import is_enabled


async def test_unknown_flag_resolves_to_off(client: AsyncClient):
    r = await client.get("/api/feature-flags/does-not-exist")
    assert r.status_code == 200
    assert r.json() == {"name": "does-not-exist", "enabled": False}


async def test_disabled_flag_is_off_even_with_full_rollout(session):
    session.add(FeatureFlag(name="disabled_flag", enabled=False, rollout_pct=100))
    await session.flush()
    assert await is_enabled(session, "disabled_flag", "any-user") is False


async def test_allowlist_forces_on(session):
    session.add(
        FeatureFlag(
            name="allowlisted",
            enabled=True,
            rollout_pct=0,
            user_allowlist=["special-user"],
        )
    )
    await session.flush()
    assert await is_enabled(session, "allowlisted", "special-user") is True
    assert await is_enabled(session, "allowlisted", "someone-else") is False


async def test_full_rollout_is_on_for_every_user(session):
    session.add(FeatureFlag(name="on_for_all", enabled=True, rollout_pct=100))
    await session.flush()
    for identity in ("a", "b", "c", "1234", None):
        assert await is_enabled(session, "on_for_all", identity) is True


async def test_rollout_is_stable_per_user(session):
    session.add(FeatureFlag(name="partial", enabled=True, rollout_pct=50))
    await session.flush()
    # Whatever the first answer is, it must not flap on re-evaluation.
    first = await is_enabled(session, "partial", "stable-user")
    for _ in range(5):
        assert await is_enabled(session, "partial", "stable-user") is first


async def test_rollout_percentage_approximates_target(session):
    session.add(FeatureFlag(name="fifty", enabled=True, rollout_pct=50))
    await session.flush()
    hits = 0
    for i in range(500):
        if await is_enabled(session, "fifty", f"user-{i}"):
            hits += 1
    # 50% rollout over 500 users — expect well within ±10% of target.
    assert 200 <= hits <= 300, f"got {hits}/500 — rollout hashing looks biased"


async def test_endpoint_returns_enabled_for_allowlisted_user(
    client: AsyncClient, session, authed_user
):
    user, token = authed_user
    session.add(
        FeatureFlag(
            name="endpoint_flag",
            enabled=True,
            rollout_pct=0,
            user_allowlist=[str(user.id)],
        )
    )
    await session.flush()
    r = await client.get(
        "/api/feature-flags/endpoint_flag",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    assert r.json() == {"name": "endpoint_flag", "enabled": True}
