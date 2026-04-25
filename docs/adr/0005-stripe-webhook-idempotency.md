# ADR 0005 — Stripe webhook idempotency

**Status:** Accepted · **Date:** 2026-04-25

## Context

Stripe guarantees *at-least-once* webhook delivery. The dashboard
documents this clearly: any non-2xx response (including a request that
times out before our handler returns) is retried, and Stripe will
occasionally double-fire on transient network errors *even after* a
successful 200. For us, `checkout.session.completed` is the only event
that mutates user state — it tops up credits — so a duplicate delivery
on that event hands a paying customer free credits and corrupts our
ledger.

Pre-PR state in `backend/app/services/stripe_service.py:106`:

```python
async def handle_checkout_completed(db, session_data):
    # ... unpack metadata ...
    await add_credits(
        db=db, user_id=UUID(user_id), amount=credits_amount,
        transaction_type="purchase",
        stripe_session_id=session_id,
    )
```

`stripe_session_id` was *recorded* on each `credit_transactions` row —
the schema author clearly anticipated needing it — but nothing checked
it before insert and the column had no unique constraint. A reviewer
doing a cold read of the payments path would catch this on the first
pass; a load test that injected a single replay would too.

## Decision

Treat `checkout.session.id` as the idempotency key for credit grants.
Defend at two layers:

1. **Application pre-check** in
   [`backend/app/services/stripe_service.py:106`](../../backend/app/services/stripe_service.py).
   On every delivery, look up an existing `CreditTransaction` with the
   same `stripe_session_id`; if found, log
   `stripe_webhook_duplicate_skipped` and return. This makes the common
   retry path quiet — no exception traces, no rollbacks.
2. **Database partial unique index** in migration
   [`i4j5k6l7m8n9_uniq_credit_tx_stripe_session_id.py`](../../backend/alembic/versions/i4j5k6l7m8n9_uniq_credit_tx_stripe_session_id.py):

   ```sql
   CREATE UNIQUE INDEX uq_credit_transactions_stripe_session_id
     ON credit_transactions (stripe_session_id)
     WHERE stripe_session_id IS NOT NULL;
   ```

   This is the race-safe authority. Two webhook deliveries arriving
   within microseconds of each other can both pass the SELECT; the
   second one's INSERT fails with `IntegrityError`, which the handler
   catches and treats as a no-op. Partial `WHERE NOT NULL` keeps
   `signup_bonus` / `test_seed` rows (which legitimately share NULL)
   out of the constraint.

Locked by `backend/tests/api/test_stripe_webhook_idempotency.py`:
replay-doesn't-double-credit, distinct-sessions-each-credit,
DB-index-blocks-collision, NULLs-don't-collide.

## Consequences

**Good**
- Stripe retries are now safe by construction — at-least-once delivery
  becomes effectively-exactly-once for credit grants.
- `credit_transactions.stripe_session_id` is no longer a "trust me, I
  meant to use this someday" column; it's load-bearing and enforced.
- The defense is symmetric: the app handles the happy path quietly, the
  DB handles the race.

**Trade-offs**
- The unique index forecloses `NULL → 'cs_xxx' → NULL → 'cs_xxx'`-style
  reuse of `stripe_session_id`. We don't do that, but a future
  manual-reconciliation script that wanted to "re-stamp" rows would
  have to clear the column first.
- We still trust Stripe-supplied `session.id`s. If Stripe ever ships a
  bug that reuses ids across distinct customers, we'd silently drop the
  second customer's credit. That's acceptable — it's never happened in
  Stripe's history and the failure mode (refund request) is bounded.

## Alternatives considered

- **Separate `stripe_webhook_events` table keyed on `event.id`.** More
  general (covers every event type, not just checkout completion) and
  what we'd build at higher event volume. Skipped today because
  `checkout.session.completed` is the only mutating event we handle —
  one extra table for one event is an abstraction we don't need yet.
  When we add subscription handling, this is the natural next step.
- **App-level lock only (no DB constraint).** Cheaper migration, but
  the SELECT-then-INSERT race is real under Stripe's burst retries
  (we've seen sub-100ms re-delivery). The DB has to be the authority.
- **Rely on Stripe's `Idempotency-Key` header.** That header is for
  *outbound* requests *to* Stripe, not for inbound webhooks Stripe
  sends *to* us. Different problem.
