import uuid
from datetime import datetime

from sqlalchemy import String, Text, DateTime, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CV(Base):
    __tablename__ = "cvs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_content: Mapped[str] = mapped_column(Text, nullable=False)
    additional_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    generated_cv_data: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    fit_analysis: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    generated_cv_raw: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="uploaded")
    page_limit: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="cvs")
    jobs = relationship("Job", back_populates="cv", lazy="selectin")
    cover_letters = relationship("CoverLetter", back_populates="cv", lazy="selectin")
