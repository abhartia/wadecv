"""add feature flags table

Revision ID: h3i4j5k6l7m8
Revises: g2h3i4j5k6l7
Create Date: 2026-04-23 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB


revision: str = "h3i4j5k6l7m8"
down_revision: Union[str, None] = "g2h3i4j5k6l7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "feature_flags",
        sa.Column("name", sa.String(100), primary_key=True),
        sa.Column("enabled", sa.Boolean, nullable=False, server_default=sa.false()),
        sa.Column("rollout_pct", sa.Integer, nullable=False, server_default="0"),
        sa.Column("user_allowlist", JSONB, nullable=True),
        sa.Column("description", sa.String(500), nullable=True),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint("rollout_pct >= 0 AND rollout_pct <= 100", name="rollout_pct_range"),
    )

    # Seed one example flag so the system is visibly exercised from day one.
    op.execute(
        """
        INSERT INTO feature_flags (name, enabled, rollout_pct, description)
        VALUES ('physical_mail_v2', false, 0, 'In-progress rewrite of physical mail flow')
        """
    )


def downgrade() -> None:
    op.drop_table("feature_flags")
