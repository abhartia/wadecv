"""Resend inbound-support webhook signature verification.

The endpoint forwards an arbitrary inbound email to the support address.
Without HMAC verification anyone on the internet can drive outbound mail
on our dime and forge support requests. Lock that here.

We exercise the wire-level endpoint through the FastAPI test client so a
future refactor that drops the verification call gets caught immediately.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import time

import pytest
from httpx import AsyncClient

from app.routers import webhook as webhook_router
from app.utils.svix_signature import (
    DEFAULT_TOLERANCE_SECONDS,
    SignatureVerificationError,
    verify,
)

# whsec_<base64> is the canonical Svix shape; raw bytes are b"\x01\x02..."
_RAW_SECRET = bytes(range(32))
_TEST_SECRET = "whsec_" + base64.b64encode(_RAW_SECRET).decode()


def _sign(msg_id: str, timestamp: str, body: bytes, secret_bytes: bytes = _RAW_SECRET) -> str:
    signed = f"{msg_id}.{timestamp}.".encode() + body
    digest = hmac.new(secret_bytes, signed, hashlib.sha256).digest()
    return "v1," + base64.b64encode(digest).decode()


def _payload() -> bytes:
    return (
        b'{"type":"email.received",'
        b'"data":{"email_id":"e_test","from":"u@example.com",'
        b'"to":["support@wadecv.com"],"subject":"hi","text":"body"}}'
    )


# ---------------------------------------------------------------------------
# Unit-level: the verifier itself
# ---------------------------------------------------------------------------


def test_verify_accepts_valid_signature():
    body = _payload()
    ts = str(int(time.time()))
    verify(
        secret=_TEST_SECRET,
        msg_id="msg_1",
        timestamp=ts,
        signature_header=_sign("msg_1", ts, body),
        body=body,
    )


def test_verify_rejects_tampered_body():
    body = _payload()
    ts = str(int(time.time()))
    sig = _sign("msg_1", ts, body)
    with pytest.raises(SignatureVerificationError):
        verify(
            secret=_TEST_SECRET,
            msg_id="msg_1",
            timestamp=ts,
            signature_header=sig,
            body=body + b"tampered",
        )


def test_verify_rejects_wrong_secret():
    body = _payload()
    ts = str(int(time.time()))
    other_secret_bytes = bytes(range(1, 33))
    bad_sig = _sign("msg_1", ts, body, secret_bytes=other_secret_bytes)
    with pytest.raises(SignatureVerificationError):
        verify(
            secret=_TEST_SECRET,
            msg_id="msg_1",
            timestamp=ts,
            signature_header=bad_sig,
            body=body,
        )


def test_verify_rejects_outside_tolerance_window():
    body = _payload()
    now = time.time()
    old_ts = str(int(now - DEFAULT_TOLERANCE_SECONDS - 1))
    sig = _sign("msg_1", old_ts, body)
    with pytest.raises(SignatureVerificationError):
        verify(
            secret=_TEST_SECRET,
            msg_id="msg_1",
            timestamp=old_ts,
            signature_header=sig,
            body=body,
            now=now,
        )


def test_verify_rejects_missing_headers():
    with pytest.raises(SignatureVerificationError):
        verify(
            secret=_TEST_SECRET,
            msg_id=None,
            timestamp="123",
            signature_header="v1,xxx",
            body=b"{}",
        )


def test_verify_accepts_one_of_rotated_signatures():
    """Svix supports comma-rotation by sending multiple `v1,...` tokens."""
    body = _payload()
    ts = str(int(time.time()))
    valid = _sign("msg_1", ts, body)
    rotated = "v1,deadbeef== " + valid  # bogus first, valid second
    verify(
        secret=_TEST_SECRET,
        msg_id="msg_1",
        timestamp=ts,
        signature_header=rotated,
        body=body,
    )


# ---------------------------------------------------------------------------
# Endpoint-level: the wiring through FastAPI
# ---------------------------------------------------------------------------


@pytest.fixture
def stub_email_forward(monkeypatch):
    """Replace the outbound forward with a no-op so tests don't hit Resend."""
    calls: list[dict] = []

    def _capture(payload: dict) -> None:
        calls.append(payload)

    monkeypatch.setattr(webhook_router, "forward_inbound_support_email", _capture)
    return calls


@pytest.fixture
def configured_secret(monkeypatch):
    """Force the router's view of settings to expose the test secret."""
    monkeypatch.setattr(webhook_router.settings, "resend_webhook_secret", _TEST_SECRET)
    monkeypatch.setattr(webhook_router.settings, "environment", "development")
    return _TEST_SECRET


async def test_endpoint_accepts_valid_signature(
    client: AsyncClient, stub_email_forward, configured_secret
):
    body = _payload()
    ts = str(int(time.time()))
    r = await client.post(
        "/api/webhook/resend/inbound-support",
        content=body,
        headers={
            "content-type": "application/json",
            "svix-id": "msg_e2e_ok",
            "svix-timestamp": ts,
            "svix-signature": _sign("msg_e2e_ok", ts, body),
        },
    )
    assert r.status_code == 200, r.text
    assert r.json() == {"status": "ok"}
    assert len(stub_email_forward) == 1


async def test_endpoint_rejects_invalid_signature(
    client: AsyncClient, stub_email_forward, configured_secret
):
    body = _payload()
    ts = str(int(time.time()))
    r = await client.post(
        "/api/webhook/resend/inbound-support",
        content=body,
        headers={
            "content-type": "application/json",
            "svix-id": "msg_e2e_bad",
            "svix-timestamp": ts,
            "svix-signature": "v1,deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef==",
        },
    )
    assert r.status_code == 401
    assert stub_email_forward == []


async def test_endpoint_rejects_missing_signature_headers(
    client: AsyncClient, stub_email_forward, configured_secret
):
    r = await client.post(
        "/api/webhook/resend/inbound-support",
        content=_payload(),
        headers={"content-type": "application/json"},
    )
    assert r.status_code == 401
    assert stub_email_forward == []


async def test_endpoint_skips_verification_in_dev_without_secret(
    client: AsyncClient, stub_email_forward, monkeypatch
):
    """`docker compose up` must work without configuring a webhook secret;
    production is gated separately by `enforce_production_requirements`."""
    monkeypatch.setattr(webhook_router.settings, "resend_webhook_secret", "")
    monkeypatch.setattr(webhook_router.settings, "environment", "development")

    r = await client.post(
        "/api/webhook/resend/inbound-support",
        content=_payload(),
        headers={"content-type": "application/json"},
    )
    assert r.status_code == 200
    assert len(stub_email_forward) == 1


async def test_endpoint_fails_closed_in_production_without_secret(
    client: AsyncClient, stub_email_forward, monkeypatch
):
    """Belt-and-suspenders for the case where the production-requirements
    check at boot is somehow bypassed (e.g. a misconfigured restart)."""
    monkeypatch.setattr(webhook_router.settings, "resend_webhook_secret", "")
    monkeypatch.setattr(webhook_router.settings, "environment", "production")

    r = await client.post(
        "/api/webhook/resend/inbound-support",
        content=_payload(),
        headers={"content-type": "application/json"},
    )
    assert r.status_code == 503
    assert stub_email_forward == []
