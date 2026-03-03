"""add cv fit_analysis column

Revision ID: c3a7f1e2d4b6
Revises: b90d818dd45f
Create Date: 2026-03-02 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = 'c3a7f1e2d4b6'
down_revision: Union[str, None] = 'b90d818dd45f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('cvs', sa.Column('fit_analysis', JSONB(), nullable=True))


def downgrade() -> None:
    op.drop_column('cvs', 'fit_analysis')
