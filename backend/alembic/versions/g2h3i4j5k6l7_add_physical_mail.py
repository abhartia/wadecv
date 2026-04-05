"""add physical mail support

Revision ID: g2h3i4j5k6l7
Revises: f1a2b3c4d5e6
Create Date: 2026-04-05 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB


# revision identifiers, used by Alembic.
revision: str = "g2h3i4j5k6l7"
down_revision: Union[str, None] = "f1a2b3c4d5e6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("mailing_address", JSONB, nullable=True))

    op.create_table(
        "physical_mails",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("job_id", UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("lob_letter_id", sa.String(255), nullable=True),
        sa.Column("content_type", sa.String(50), nullable=False),
        sa.Column("to_address", JSONB, nullable=False),
        sa.Column("from_address", JSONB, nullable=False),
        sa.Column("status", sa.String(50), server_default="created"),
        sa.Column("credits_charged", sa.Integer, server_default="5"),
        sa.Column("custom_cv_pdf", sa.LargeBinary, nullable=True),
        sa.Column("custom_cover_letter_pdf", sa.LargeBinary, nullable=True),
        sa.Column("error_message", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("physical_mails")
    op.drop_column("users", "mailing_address")
