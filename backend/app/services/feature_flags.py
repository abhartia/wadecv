"""Feature-flag resolution.

A flag is ON for a given user iff all of these hold:
  * row exists and `enabled == True`
  * user_id is in user_allowlist OR hash(flag_name|user_id) mod 100 < rollout_pct

The hash is salted by flag name so the same user isn't in the "lucky 10%" for
every flag. Anonymous requests use IP as the identity — acceptable at our
scale, and documented.
"""

from __future__ import annotations

import hashlib

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.feature_flag import FeatureFlag


def _bucket(flag_name: str, identity: str) -> int:
    h = hashlib.sha256(f"{flag_name}|{identity}".encode()).hexdigest()
    return int(h[:8], 16) % 100


async def is_enabled(db: AsyncSession, flag_name: str, identity: str | None) -> bool:
    result = await db.execute(select(FeatureFlag).where(FeatureFlag.name == flag_name))
    flag = result.scalar_one_or_none()
    if flag is None or not flag.enabled:
        return False
    if identity and flag.user_allowlist and identity in flag.user_allowlist:
        return True
    if flag.rollout_pct >= 100:
        return True
    if flag.rollout_pct <= 0:
        return False
    return _bucket(flag_name, identity or "anonymous") < flag.rollout_pct


def flag_enabled(flag_name: str):
    """FastAPI dependency: yields a bool for the given flag + current user.

    Usage:
        @router.get("/foo")
        async def foo(enabled: bool = Depends(flag_enabled("foo_v2"))):
            ...
    """
    from app.utils.auth import get_current_user_optional  # local import to avoid cycle

    async def _resolver(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user_optional),
    ) -> bool:
        identity = str(user.id) if user else None
        return await is_enabled(db, flag_name, identity)

    return _resolver
