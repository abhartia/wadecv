"""Svix-style webhook signature verification.

Resend dispatches webhooks via Svix, which signs each delivery with three
headers:

    svix-id           — unique attempt id, replay-protection nonce
    svix-timestamp    — unix seconds, used to bound replay window
    svix-signature    — space-separated list of `v1,<b64-hmac-sha256>` tokens

The signed payload is the literal string `${svix-id}.${svix-timestamp}.${body}`.
The HMAC key is the raw bytes of the configured secret (Svix secrets are
distributed in the form `whsec_<base64>`; this module accepts either form
and strips the prefix transparently).

Multiple signature tokens in the header support secret rotation: a delivery
is accepted if ANY token verifies against the current secret.

This module intentionally has zero third-party dependencies — `hmac` and
`hashlib` from the standard library are sufficient and avoid pulling in
the official Svix SDK (which is fine but is one more transitive dep we
don't need for ~30 lines of code).
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import time

# Svix's documented default tolerance is 5 minutes either side of "now".
# We mirror it exactly so behaviour matches the Svix SDK.
DEFAULT_TOLERANCE_SECONDS = 5 * 60


class SignatureVerificationError(Exception):
    """Raised when a webhook signature cannot be verified."""


def _decode_secret(secret: str) -> bytes:
    """Return the raw HMAC key bytes for a Svix-format secret."""
    if not secret:
        raise SignatureVerificationError("webhook secret is empty")
    payload = secret.removeprefix("whsec_")
    try:
        return base64.b64decode(payload)
    except (ValueError, TypeError) as exc:
        raise SignatureVerificationError("webhook secret is not valid base64") from exc


def verify(
    *,
    secret: str,
    msg_id: str | None,
    timestamp: str | None,
    signature_header: str | None,
    body: bytes,
    now: float | None = None,
    tolerance_seconds: int = DEFAULT_TOLERANCE_SECONDS,
) -> None:
    """Raise SignatureVerificationError if the delivery is not authentic.

    Returns None on success; the caller does not need the result.
    """
    if not msg_id or not timestamp or not signature_header:
        raise SignatureVerificationError("missing svix signature headers")

    try:
        ts_int = int(timestamp)
    except ValueError as exc:
        raise SignatureVerificationError("svix-timestamp is not an integer") from exc

    current = now if now is not None else time.time()
    if abs(current - ts_int) > tolerance_seconds:
        raise SignatureVerificationError("svix-timestamp outside tolerance window")

    key = _decode_secret(secret)
    signed_payload = f"{msg_id}.{timestamp}.".encode() + body
    expected = base64.b64encode(hmac.new(key, signed_payload, hashlib.sha256).digest()).decode()

    # Header looks like "v1,abc... v1,def..." — accept any token that matches
    # so we tolerate Svix-style key rotation without a code change.
    for token in signature_header.split():
        version, _, value = token.partition(",")
        if version != "v1" or not value:
            continue
        if hmac.compare_digest(value, expected):
            return

    raise SignatureVerificationError("no svix signature matched")
