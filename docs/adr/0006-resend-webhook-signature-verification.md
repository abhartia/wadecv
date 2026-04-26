# ADR 0006 — Resend inbound-support webhook signature verification

**Status:** Accepted · **Date:** 2026-04-26

## Context

`POST /api/webhook/resend/inbound-support` is a public, unauthenticated
endpoint that Resend invokes when an email arrives at our support address.
The handler in
[`backend/app/routers/webhook.py`](../../backend/app/routers/webhook.py)
calls `forward_inbound_support_email`, which in turn calls Resend's outbound
API to relay the message to `support_forward_to`.

Pre-PR, the only thing preventing abuse was *nobody knowing the URL*. That
isn't a security control. A reviewer (or any opportunistic crawler) hitting
the endpoint with a forged JSON body would:

1. Cause an outbound Resend API call billed to our account — a free relay
   for whatever subject/body/from they choose.
2. Send a "support email" to our inbox with attacker-controlled `from`
   metadata. The metadata block is the only audit trail; spoofing it
   defeats triage.
3. At volume, exhaust our outbound mail quota with junk before legitimate
   support traffic gets through.

The Stripe webhook next door already does signature verification via the
official SDK — this ADR closes the matching gap on the Resend webhook.

## Decision

Verify the Svix-format signature Resend ships with every delivery, before
parsing the body or doing any work.

Resend dispatches webhooks via Svix and signs each request with three
headers:

```
svix-id           unique attempt id (replay-protection nonce)
svix-timestamp    unix seconds, bounds the replay window
svix-signature    space-separated `v1,<b64-hmac-sha256>` tokens
```

The signed payload is the literal string `${svix-id}.${svix-timestamp}.${body}`,
HMAC-SHA256'd under the per-endpoint secret (configured as `whsec_<base64>`).
Multiple `v1,...` tokens in the signature header support secret rotation —
we accept any token that verifies.

Implementation:
- [`backend/app/utils/svix_signature.py`](../../backend/app/utils/svix_signature.py)
  — ~50 lines, stdlib `hmac` + `hashlib` only. No new dependency. Uses
  `hmac.compare_digest` for timing-safe comparison and Svix's documented
  5-minute tolerance window.
- [`backend/app/routers/webhook.py`](../../backend/app/routers/webhook.py)
  reads the raw body once, verifies before parsing, returns 401 on failure.
  Pydantic validation runs only after a successful signature check.
- [`backend/app/config.py`](../../backend/app/config.py) adds
  `resend_webhook_secret` and includes it in
  `enforce_production_requirements` so the app refuses to boot in
  production without a configured secret. In development the secret is
  optional — `docker compose up` still works zero-config.

Locked by
[`backend/tests/api/test_resend_webhook_signature.py`](../../backend/tests/api/test_resend_webhook_signature.py):
valid signature accepted, tampered body rejected, wrong secret rejected,
expired timestamp rejected, missing headers rejected, rotated-secret
header still verifies, dev-without-secret path works, prod-without-secret
fails closed at the endpoint as a belt-and-suspenders check.

## Consequences

**Good**
- Symmetric with the Stripe webhook: both inbound integration points now
  authenticate the sender at the edge.
- Failure mode for misconfiguration is loud and early — production refuses
  to boot if the secret is absent, rather than silently accepting attacker
  traffic.
- No new runtime dependency. The Svix Python SDK works fine but is one
  more transitive dep for ~30 lines of code we can write against the
  standard library.

**Trade-offs**
- Operators must add `RESEND_WEBHOOK_SECRET` to App Service config before
  the next production deploy. Documented in
  [`docs/runbook.md`](../runbook.md). Until then the deploy will fail at
  app start with a clear `Missing required production settings` error —
  preferable to a silently-accepting endpoint.
- Dev mode with no configured secret skips verification entirely. Anyone
  with shell access to a dev container can drive the endpoint, but the
  blast radius is one developer's outbound Resend quota — acceptable.

## Alternatives considered

- **Svix Python SDK.** One-line verification call, but pulls in the SDK
  and its transitive dependencies for behaviour we can implement in
  ~50 lines of stdlib. Worth revisiting if we add a second Svix-signed
  webhook (Stripe is not Svix-signed).
- **IP allowlist.** Resend documents their egress IPs, but they reserve
  the right to change them and pinning IPs trades a real authentication
  control for a brittle operational one. Signature verification is the
  documented and stable mechanism.
- **Shared bearer token in a header.** Simpler, but requires us to invent
  rotation and replay protection that Svix already solves. Reuse Svix.
