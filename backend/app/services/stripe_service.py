import logging

import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user import User
from app.services.credits import CREDIT_PACKS, add_credits

settings = get_settings()
stripe.api_key = settings.stripe_secret_key

logger = logging.getLogger(__name__)


class PaymentError(Exception):
    pass


async def create_checkout_session(db: AsyncSession, user: User, pack_id: str) -> str:
    pack = CREDIT_PACKS.get(pack_id)
    if not pack:
        raise ValueError(f"Invalid pack: {pack_id}")

    if not user.stripe_customer_id:
        customer = stripe.Customer.create(email=user.email, metadata={"user_id": str(user.id)})
        user.stripe_customer_id = customer.id
        await db.flush()

    def _build_line_items() -> list[dict]:
        return [
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"WadeCV {pack['name']} Pack - {pack['credits']} Credits",
                        "description": f"{pack['credits']} CV generation credits",
                    },
                    "unit_amount": pack["price_cents"],
                },
                "quantity": 1,
            }
        ]

    try:
        session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id,
            payment_method_types=["card"],
            line_items=_build_line_items(),
            mode="payment",
            success_url=f"{settings.frontend_url}/dashboard",
            cancel_url=f"{settings.frontend_url}/billing?cancelled=true",
            metadata={
                "user_id": str(user.id),
                "pack_id": pack_id,
                "credits": str(pack["credits"]),
            },
        )
    except stripe.error.InvalidRequestError as e:
        message = str(e)
        if "No such customer" in message:
            logger.warning(
                "Stripe reported missing customer; recreating for user.",
                extra={"user_id": str(user.id), "pack_id": pack_id, "stripe_customer_id": user.stripe_customer_id},
            )
            user.stripe_customer_id = None
            await db.flush()

            customer = stripe.Customer.create(email=user.email, metadata={"user_id": str(user.id)})
            user.stripe_customer_id = customer.id
            await db.flush()

            session = stripe.checkout.Session.create(
                customer=user.stripe_customer_id,
                payment_method_types=["card"],
                line_items=_build_line_items(),
                mode="payment",
                success_url=f"{settings.frontend_url}/dashboard",
                cancel_url=f"{settings.frontend_url}/billing?cancelled=true",
                metadata={
                    "user_id": str(user.id),
                    "pack_id": pack_id,
                    "credits": str(pack["credits"]),
                },
            )
        else:
            logger.exception(
                "Stripe invalid request error during checkout session creation.",
                extra={"user_id": str(user.id), "pack_id": pack_id},
            )
            raise PaymentError("There was an issue with the payment service. Please try again.") from e
    except stripe.error.StripeError as e:
        logger.exception(
            "Stripe error during checkout session creation.",
            extra={"user_id": str(user.id), "pack_id": pack_id},
        )
        raise PaymentError("There was an issue with the payment service. Please try again.") from e

    return session.url


async def handle_checkout_completed(db: AsyncSession, session_data: dict):
    metadata = session_data.get("metadata", {})
    user_id = metadata.get("user_id")
    pack_id = metadata.get("pack_id")
    credits_amount = int(metadata.get("credits", 0))
    session_id = session_data.get("id")

    if not user_id or not credits_amount:
        return

    from uuid import UUID
    await add_credits(
        db=db,
        user_id=UUID(user_id),
        amount=credits_amount,
        transaction_type="purchase",
        description=f"Purchased {CREDIT_PACKS.get(pack_id, {}).get('name', '')} pack ({credits_amount} credits)",
        stripe_session_id=session_id,
    )
