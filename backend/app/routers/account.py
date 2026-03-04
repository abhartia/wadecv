from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.auth import ChangePasswordRequest, ProfileUpdateRequest, UserResponse
from app.utils.auth import get_current_user, hash_password, verify_password
from app.utils.parsing import parse_cv_file
from app.services.email import send_deletion_confirmation

router = APIRouter()


@router.put("/password")
async def change_password(
    req: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not user.password_hash:
        raise HTTPException(status_code=400, detail="Account uses magic link authentication. Set a password first.")

    if not verify_password(req.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user.password_hash = hash_password(req.new_password)
    return {"message": "Password updated"}


@router.put("/set-password")
async def set_password(
    req: dict,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if user.password_hash:
        raise HTTPException(
            status_code=400,
            detail="You already have a password. Use the change password form instead.",
        )

    password = req.get("password", "")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    user.password_hash = hash_password(password)
    return {"message": "Password set successfully"}


@router.delete("/delete")
async def delete_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    email = user.email
    user.deleted_at = datetime.now(timezone.utc)
    user.email = f"deleted_{user.id}@deleted.wadecv.com"

    try:
        send_deletion_confirmation(email)
    except Exception:
        pass

    return {"message": "Account scheduled for deletion. All data will be permanently removed."}


@router.get("/profile", response_model=UserResponse)
async def get_profile(user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified,
        credits=user.credits,
        has_profile=bool(user.base_cv_content),
        has_password=bool(user.password_hash),
        base_cv_content=user.base_cv_content,
        additional_info=user.additional_info,
        cv_page_limit=getattr(user, "cv_page_limit", 2) or 2,
        created_at=user.created_at.isoformat(),
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    req: ProfileUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if req.base_cv_content is not None:
        user.base_cv_content = req.base_cv_content
    if req.additional_info is not None:
        user.additional_info = req.additional_info
    if req.cv_page_limit is not None:
        user.cv_page_limit = req.cv_page_limit
    await db.flush()
    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified,
        credits=user.credits,
        has_profile=bool(user.base_cv_content),
        has_password=bool(user.password_hash),
        base_cv_content=user.base_cv_content,
        additional_info=user.additional_info,
        cv_page_limit=getattr(user, "cv_page_limit", 2) or 2,
        created_at=user.created_at.isoformat(),
    )


@router.post("/profile/upload", response_model=UserResponse)
async def upload_profile_cv(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    try:
        text = parse_cv_file(contents, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file")

    user.base_cv_content = text
    await db.flush()

    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified,
        credits=user.credits,
        has_profile=bool(user.base_cv_content),
        has_password=bool(user.password_hash),
        base_cv_content=user.base_cv_content,
        additional_info=user.additional_info,
        cv_page_limit=getattr(user, "cv_page_limit", 2) or 2,
        created_at=user.created_at.isoformat(),
    )
