from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.credit import CreditTransaction
from app.schemas.credit import CreditPack, CheckoutRequest, CheckoutResponse, CreditBalanceResponse, CreditTransactionResponse
from app.utils.auth import get_current_user
from app.services.credits import CREDIT_PACKS
from app.services.stripe_service import create_checkout_session

router = APIRouter()


@router.get("/packs", response_model=list[CreditPack])
async def get_packs():
    return [
        CreditPack(id=pack_id, **pack)
        for pack_id, pack in CREDIT_PACKS.items()
    ]


@router.get("/balance", response_model=CreditBalanceResponse)
async def get_balance(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CreditTransaction)
        .where(CreditTransaction.user_id == user.id)
        .order_by(CreditTransaction.created_at.desc())
        .limit(50)
    )
    transactions = result.scalars().all()

    return CreditBalanceResponse(
        credits=user.credits,
        transactions=[
            CreditTransactionResponse(
                id=str(t.id), amount=t.amount, type=t.type,
                description=t.description, created_at=t.created_at.isoformat(),
            )
            for t in transactions
        ],
    )


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    req: CheckoutRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        url = await create_checkout_session(db, user, req.pack_id)
        return CheckoutResponse(checkout_url=url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
