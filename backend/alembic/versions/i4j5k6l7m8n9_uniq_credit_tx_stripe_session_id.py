"""unique partial index on credit_transactions.stripe_session_id

Locks Stripe webhook idempotency at the database layer: two concurrent
deliveries of the same checkout.session.completed event can no longer
both persist a credit row. The application checks first and returns
early on the second delivery; this index is the belt-and-suspenders
catch for the race window between SELECT and INSERT.

Partial WHERE NOT NULL because pre-existing seed/test rows
(`type='signup_bonus'`, `type='test_seed'`) intentionally leave the
column NULL, and we don't want them all colliding on each other.

Revision ID: i4j5k6l7m8n9
Revises: h3i4j5k6l7m8
Create Date: 2026-04-25 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


revision: str = "i4j5k6l7m8n9"
down_revision: Union[str, None] = "h3i4j5k6l7m8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "uq_credit_transactions_stripe_session_id",
        "credit_transactions",
        ["stripe_session_id"],
        unique=True,
        postgresql_where="stripe_session_id IS NOT NULL",
    )


def downgrade() -> None:
    op.drop_index(
        "uq_credit_transactions_stripe_session_id",
        table_name="credit_transactions",
    )
