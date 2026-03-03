"""add page_limit to cvs and cv_page_limit to users

Revision ID: d4e5f6a7b8c9
Revises: c3a7f1e2d4b6
Create Date: 2026-03-02 19:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, None] = 'c3a7f1e2d4b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('cvs', sa.Column('page_limit', sa.Integer(), nullable=False, server_default='2'))
    op.add_column('users', sa.Column('cv_page_limit', sa.Integer(), nullable=False, server_default='2'))


def downgrade() -> None:
    op.drop_column('cvs', 'page_limit')
    op.drop_column('users', 'cv_page_limit')
