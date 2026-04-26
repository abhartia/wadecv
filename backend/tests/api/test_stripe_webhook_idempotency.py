"""Stripe webhook idempotency.

Stripe retries delivery on any non-2xx and very occasionally double-fires
on transient network errors. The webhook handler must treat the checkout
session id as an idempotency key so a paying user is never credited twice
for one purchase.

These tests exercise `handle_checkout_completed` directly — the wire-level
endpoint adds Stripe signature verification on top, which is mocked out
in production by the Stripe SDK and not what we're locking here.
"""

from __future__ import annotations

import pytest
from sqlalchemy import func, select

from app.models.credit import CreditTransaction
from app.models.user import User
from app.services.stripe_service import handle_checkout_completed


def _event(user_id: str, session_id: str, credits: int = 20) -> dict:
    return {
        "id": session_id,
        "metadata": {
            "user_id": user_id,
            "pack_id": "starter",
            "credits": str(credits),
        },
    }


async def _credit_count(session, user_id, stripe_session_id: str) -> int:
    r = await session.execute(
        select(func.count(CreditTransaction.id)).where(
            CreditTransaction.user_id == user_id,
            CreditTransaction.stripe_session_id == stripe_session_id,
        )
    )
    return r.scalar_one()


async def test_replaying_same_checkout_does_not_double_credit(session, authed_user):
    user, _ = authed_user
    starting_credits = user.credits
    event = _event(str(user.id), "cs_test_replay_0001", credits=20)

    await handle_checkout_completed(session, event)
    await session.flush()
    await handle_checkout_completed(session, event)
    await session.flush()

    refreshed = (await session.execute(select(User).where(User.id == user.id))).scalar_one()
    assert refreshed.credits == starting_credits + 20
    assert await _credit_count(session, user.id, "cs_test_replay_0001") == 1


async def test_distinct_sessions_each_credit(session, authed_user):
    """Sanity: idempotency keys off session id, not user id."""
    user, _ = authed_user
    starting_credits = user.credits

    await handle_checkout_completed(session, _event(str(user.id), "cs_test_distinct_a", 20))
    await session.flush()
    await handle_checkout_completed(session, _event(str(user.id), "cs_test_distinct_b", 50))
    await session.flush()

    refreshed = (await session.execute(select(User).where(User.id == user.id))).scalar_one()
    assert refreshed.credits == starting_credits + 70


async def test_db_unique_index_blocks_duplicate_at_storage_layer(session, authed_user):
    """Belt-and-suspenders: even if the app-level dedupe were bypassed, the
    unique partial index on credit_transactions.stripe_session_id rejects
    a second row with the same id."""
    from sqlalchemy.exc import IntegrityError

    user, _ = authed_user
    session.add(
        CreditTransaction(
            user_id=user.id,
            amount=20,
            type="purchase",
            description="first",
            stripe_session_id="cs_test_index_lock",
        )
    )
    await session.flush()

    session.add(
        CreditTransaction(
            user_id=user.id,
            amount=20,
            type="purchase",
            description="second",
            stripe_session_id="cs_test_index_lock",
        )
    )
    with pytest.raises(IntegrityError):
        await session.flush()
    await session.rollback()


async def test_null_stripe_session_ids_do_not_collide(session, authed_user):
    """Non-Stripe transactions (signup_bonus, test_seed) leave the column
    NULL — the partial index must not treat NULLs as duplicates."""
    user, _ = authed_user
    for _ in range(3):
        session.add(
            CreditTransaction(
                user_id=user.id,
                amount=1,
                type="signup_bonus",
                description="extra",
                stripe_session_id=None,
            )
        )
    await session.flush()  # would raise if NULLs collided
