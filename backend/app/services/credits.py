from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.credit import CreditTransaction
from app.models.user import User

CREDIT_PACKS = {
    "starter": {"name": "Starter", "credits": 20, "price_cents": 1000, "price_display": "$10"},
    "value": {"name": "Value", "credits": 50, "price_cents": 1500, "price_display": "$15"},
    "pro": {"name": "Pro", "credits": 100, "price_cents": 2000, "price_display": "$20"},
}


async def add_credits(
    db: AsyncSession,
    user_id,
    amount: int,
    transaction_type: str,
    description: str,
    stripe_session_id: str | None = None,
):
    result = await db.execute(select(User).where(User.id == user_id).with_for_update())
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.credits += amount

    transaction = CreditTransaction(
        user_id=user_id,
        amount=amount,
        type=transaction_type,
        description=description,
        stripe_session_id=stripe_session_id,
    )
    db.add(transaction)
    await db.flush()
    return user.credits


async def deduct_credits(
    db: AsyncSession,
    user_id,
    amount: int,
    transaction_type: str,
    description: str,
) -> int:
    result = await db.execute(select(User).where(User.id == user_id).with_for_update())
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.credits < amount:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits. Please purchase more credits to continue.",
        )

    user.credits -= amount

    transaction = CreditTransaction(
        user_id=user_id,
        amount=-amount,
        type=transaction_type,
        description=description,
    )
    db.add(transaction)
    await db.flush()
    return user.credits


async def deduct_credit(db: AsyncSession, user_id) -> int:
    return await deduct_credits(db, user_id, 1, "cv_generation", "CV generation")
