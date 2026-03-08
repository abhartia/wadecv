"""set default page_limit and cv_page_limit to 1

Revision ID: a1b2c3d4e5f6
Revises: d4e5f6a7b8c9
Create Date: 2026-03-08 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'cvs',
        'page_limit',
        existing_type=sa.Integer(),
        server_default='1',
    )
    op.alter_column(
        'users',
        'cv_page_limit',
        existing_type=sa.Integer(),
        server_default='1',
    )


def downgrade() -> None:
    op.alter_column(
        'cvs',
        'page_limit',
        existing_type=sa.Integer(),
        server_default='2',
    )
    op.alter_column(
        'users',
        'cv_page_limit',
        existing_type=sa.Integer(),
        server_default='2',
    )
