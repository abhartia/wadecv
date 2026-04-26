import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    # Partial unique index on stripe_session_id locks Stripe webhook
    # idempotency at the DB layer — two concurrent deliveries of the same
    # event cannot both insert a credit row. WHERE NOT NULL because
    # non-Stripe transaction types (signup_bonus, etc.) legitimately
    # share NULL.
    __table_args__ = (
        Index(
            "uq_credit_transactions_stripe_session_id",
            "stripe_session_id",
            unique=True,
            postgresql_where=text("stripe_session_id IS NOT NULL"),
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    stripe_session_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="credit_transactions")
