from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class FeatureFlag(Base):
    """Postgres-backed feature flag. See docs/adr/0003-feature-flags-in-db.md.

    Resolution order:
      1. If `enabled` is False → off for everyone.
      2. If user_id is in `user_allowlist` → on.
      3. Otherwise compute a stable hash of user_id and compare to rollout_pct.
    """

    __tablename__ = "feature_flags"

    name: Mapped[str] = mapped_column(String(100), primary_key=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    rollout_pct: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    user_allowlist: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
