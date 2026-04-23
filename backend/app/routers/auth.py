import contextlib
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.credit import CreditTransaction
from app.models.user import MagicLink, User
from app.schemas.auth import (
    LoginRequest,
    MagicLinkRequest,
    MagicLinkVerify,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.email import send_magic_link, send_signup_notification, send_verification_email
from app.utils.auth import (
    create_access_token,
    create_magic_link_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter()
settings = get_settings()


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=req.email,
        password_hash=hash_password(req.password) if req.password else None,
        email_verified=False,
        credits=1,
    )
    db.add(user)
    await db.flush()

    tx = CreditTransaction(
        user_id=user.id, amount=1, type="signup_bonus", description="Free signup credit"
    )
    db.add(tx)

    if req.password:
        token = create_magic_link_token()
        ml = MagicLink(
            user_id=user.id,
            token=token,
            expires_at=datetime.now(UTC) + timedelta(hours=24),
        )
        db.add(ml)
        with contextlib.suppress(Exception):
            send_verification_email(req.email, token)

    with contextlib.suppress(Exception):
        send_signup_notification(
            user.email, signup_method="password_register", user_id=str(user.id)
        )

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.email == req.email, User.deleted_at.is_(None))
    )
    user = result.scalar_one_or_none()
    if not user or not user.password_hash:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/magic-link")
async def request_magic_link(req: MagicLinkRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.email == req.email, User.deleted_at.is_(None))
    )
    user = result.scalar_one_or_none()

    if not user:
        user = User(email=req.email, email_verified=True, credits=1)
        db.add(user)
        await db.flush()
        tx = CreditTransaction(
            user_id=user.id, amount=1, type="signup_bonus", description="Free signup credit"
        )
        db.add(tx)
        with contextlib.suppress(Exception):
            send_signup_notification(user.email, signup_method="magic_link", user_id=str(user.id))

    token = create_magic_link_token()
    ml = MagicLink(
        user_id=user.id,
        token=token,
        expires_at=datetime.now(UTC) + timedelta(minutes=settings.magic_link_expire_minutes),
    )
    db.add(ml)
    await db.flush()

    with contextlib.suppress(Exception):
        send_magic_link(req.email, token)

    return {"message": "If an account exists, a magic link has been sent to your email."}


@router.post("/magic-link/verify", response_model=TokenResponse)
async def verify_magic_link(req: MagicLinkVerify, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MagicLink).where(MagicLink.token == req.token, MagicLink.used.is_(False))
    )
    ml = result.scalar_one_or_none()
    if not ml or ml.expires_at < datetime.now(UTC):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired link"
        )

    ml.used = True
    result = await db.execute(select(User).where(User.id == ml.user_id))
    user = result.scalar_one()
    user.email_verified = True

    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/verify-email")
async def verify_email(req: MagicLinkVerify, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MagicLink).where(MagicLink.token == req.token, MagicLink.used.is_(False))
    )
    ml = result.scalar_one_or_none()
    if not ml or ml.expires_at < datetime.now(UTC):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired link"
        )

    ml.used = True
    result = await db.execute(select(User).where(User.id == ml.user_id))
    user = result.scalar_one()
    user.email_verified = True
    return {"message": "Email verified successfully"}


@router.post("/refresh", response_model=TokenResponse)
async def refresh_tokens(req_body: dict):
    refresh_token = req_body.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Refresh token required"
        )

    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user_id = payload.get("sub")
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(user.id),
        email=user.email,
        email_verified=user.email_verified,
        credits=user.credits,
        has_profile=bool(user.base_cv_content),
        has_password=bool(user.password_hash),
        base_cv_content=user.base_cv_content,
        additional_info=user.additional_info,
        cv_page_limit=getattr(user, "cv_page_limit", 1) or 1,
        mailing_address=user.mailing_address,
        created_at=user.created_at.isoformat(),
    )


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}
