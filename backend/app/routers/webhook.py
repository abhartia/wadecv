import stripe
from fastapi import APIRouter, Request, HTTPException

from app.config import get_settings
from app.database import async_session
from app.services.stripe_service import handle_checkout_completed

router = APIRouter()
settings = get_settings()


@router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]
        async with async_session() as db:
            await handle_checkout_completed(db, session_data)
            await db.commit()

    return {"status": "ok"}
