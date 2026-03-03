import logging
from typing import Any, Dict, List, Optional, Union

import stripe
from fastapi import APIRouter, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field

from app.config import get_settings
from app.database import async_session
from app.services.email import forward_inbound_support_email
from app.services.stripe_service import handle_checkout_completed

router = APIRouter()
settings = get_settings()
logger = logging.getLogger(__name__)


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


class ResendInboundEmail(BaseModel):
    id: Optional[str] = None
    from_: Optional[str] = Field(None, alias="from")
    to: Optional[Union[str, List[str]]] = None
    subject: Optional[str] = None
    text: Optional[str] = None
    html: Optional[str] = None
    headers: Optional[Dict[str, Any]] = None

    model_config = {"populate_by_name": True, "extra": "allow"}


@router.post("/resend/inbound-support")
async def resend_inbound_support_webhook(payload: ResendInboundEmail):
    try:
        data = payload.model_dump(by_alias=True)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid payload")

    try:
        await run_in_threadpool(forward_inbound_support_email, data)
    except Exception:
        logger.exception("Failed to forward inbound support email via Resend")
        raise HTTPException(status_code=502, detail="Failed to forward inbound email")

    return {"status": "ok"}
