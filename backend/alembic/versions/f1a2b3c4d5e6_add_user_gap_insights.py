"""add user gap_insights analytics fields

Revision ID: f1a2b3c4d5e6
Revises: a1b2c3d4e5f6
Create Date: 2026-03-13 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
  op.add_column("users", sa.Column("gap_insights", JSONB(), nullable=True))
  op.add_column("users", sa.Column("gap_insights_job_count", sa.Integer(), nullable=False, server_default="0"))


def downgrade() -> None:
  op.drop_column("users", "gap_insights_job_count")
  op.drop_column("users", "gap_insights")
