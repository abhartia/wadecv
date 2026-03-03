import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, Integer, DateTime, Text, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str | None] = mapped_column(String(128), nullable=True)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    credits: Mapped[int] = mapped_column(Integer, default=0)
    stripe_customer_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    base_cv_content: Mapped[str | None] = mapped_column(Text, nullable=True)
    additional_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    cv_page_limit: Mapped[int] = mapped_column(Integer, default=2)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    cvs = relationship("CV", back_populates="user", lazy="selectin")
    jobs = relationship("Job", back_populates="user", lazy="selectin")
    credit_transactions = relationship("CreditTransaction", back_populates="user", lazy="selectin")
    magic_links = relationship("MagicLink", back_populates="user", lazy="selectin")


class MagicLink(Base):
    __tablename__ = "magic_links"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    used: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="magic_links")
