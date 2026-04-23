from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.feature_flag import FeatureFlagResponse
from app.services.feature_flags import is_enabled
from app.utils.auth import get_current_user_optional

router = APIRouter()


@router.get("/{name}", response_model=FeatureFlagResponse)
async def get_flag(
    name: str,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
) -> FeatureFlagResponse:
    """Evaluate a single flag for the current user.

    Returns `{"name": "...", "enabled": false}` when the flag doesn't exist —
    callers treat "unknown" and "off" identically, which matches how flags
    behave in practice (an unreleased flag is an off flag).
    """
    identity = str(user.id) if user else None
    return FeatureFlagResponse(name=name, enabled=await is_enabled(db, name, identity))
