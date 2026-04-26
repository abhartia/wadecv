import logging

import stripe
from fastapi import APIRouter, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field, ValidationError

from app.config import get_settings
from app.database import async_session
from app.services.email import forward_inbound_support_email
from app.services.stripe_service import handle_checkout_completed
from app.utils.svix_signature import SignatureVerificationError
from app.utils.svix_signature import verify as verify_svix

router = APIRouter()
settings = get_settings()
logger = logging.getLogger(__name__)


@router.post("/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
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


class ResendEmailReceivedData(BaseModel):
    email_id: str
    from_: str | None = Field(None, alias="from")
    to: list[str] | None = None
    subject: str | None = None
    message_id: str | None = None

    model_config = {"populate_by_name": True, "extra": "allow"}


class ResendEmailReceivedEvent(BaseModel):
    type: str
    data: ResendEmailReceivedData

    model_config = {"extra": "allow"}


@router.post("/resend/inbound-support")
async def resend_inbound_support_webhook(request: Request):
    """Forward an inbound support email Resend received on our behalf.

    Resend dispatches via Svix; the body is HMAC-signed with a per-endpoint
    secret. Verifying here is non-negotiable: without it, anyone on the
    internet can POST a forged payload and trigger an outbound email to the
    support address (free relay + spam vector + spoofed-sender risk). See
    docs/adr/0006-resend-webhook-signature-verification.md.

    In non-production with no secret configured we accept the request so
    `docker compose up` works for local exploration; production fails closed
    via `enforce_production_requirements` at app start.
    """
    body = await request.body()

    secret = settings.resend_webhook_secret
    if secret:
        try:
            verify_svix(
                secret=secret,
                msg_id=request.headers.get("svix-id"),
                timestamp=request.headers.get("svix-timestamp"),
                signature_header=request.headers.get("svix-signature"),
                body=body,
            )
        except SignatureVerificationError as exc:
            logger.warning("resend_webhook_signature_invalid reason=%s", exc)
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
    elif settings.environment == "production":
        # Belt-and-suspenders — `enforce_production_requirements` should
        # already prevent boot, but if it's ever bypassed we still refuse.
        raise HTTPException(status_code=503, detail="Webhook secret not configured")

    try:
        event = ResendEmailReceivedEvent.model_validate_json(body)
    except ValidationError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    payload = event.data.model_dump(by_alias=True)

    try:
        await run_in_threadpool(forward_inbound_support_email, payload)
    except Exception:
        logger.exception("Failed to forward inbound support email via Resend")
        raise HTTPException(status_code=502, detail="Failed to forward inbound email")

    return {"status": "ok"}
