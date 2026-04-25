# ADR 0004 — Baseline security response headers

**Status:** Accepted · **Date:** 2026-04-24

## Context

PR #16 hardened the Next.js frontend with the baseline web response headers
(extracted to `frontend/src/lib/security-headers.ts`, locked by Vitest +
Playwright). The FastAPI backend was still bare — not even
`X-Content-Type-Options: nosniff` — which a security review would flag the
moment they probed `wadecv-backend.azurewebsites.net` directly.

This ADR closes that gap on the backend edge with a `SecurityHeadersMiddleware`
that mirrors the frontend baseline (plus two API-only headers: COOP, CORP).
Both edges now ship the same defensive baseline, so a request that bypasses
the frontend reverse proxy still gets the headers it needs.

A strict `Content-Security-Policy` is deliberately still out of scope —
needs a report-only rollout with allowlist iteration to avoid breaking Stripe
Checkout, Sentry, Langfuse, and inline Next.js hydration scripts. Its own
ADR when ready.

## Decision

Mirror the frontend baseline on the FastAPI backend, with two API-specific
additions (COOP, CORP):

| Header | Value | Why |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Stops browsers MIME-sniffing JSON error bodies into HTML. |
| `X-Frame-Options` | `DENY` | WadeCV is never embedded; refuse framing to kill clickjacking surface. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leak origin but never full URL on cross-site navigation. |
| `Permissions-Policy` | `accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()` | Opt out of every legacy / invasive browser API we don't use, including FLoC and Topics. |
| `Cross-Origin-Opener-Policy` | `same-origin` (backend only) | Isolate browsing context groups from any window we didn't open. |
| `Cross-Origin-Resource-Policy` | `same-site` (backend only) | Prevents `<img>`/`<script>` cross-site inclusion of API responses. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Frontend: always. Backend: production only (browsers ignore HSTS on non-HTTPS dev anyway, but keeping the wire clean is less confusing). |

Backend implementation: `backend/app/middleware/security_headers.py`, wired
in `backend/app/main.py:110` so headers land even on 429s and 404s (the one
case where `nosniff` on an error body actually matters).

Frontend baseline lives in `frontend/src/lib/security-headers.ts` (PR #16,
already shipped) and is consumed by `frontend/next.config.ts:20`.

## Consequences

**Good**
- Baseline `securityheaders.com` grade moves from `D` to `A`.
- Zero behavior change — no endpoint breaks, no third-party integration
  affected.
- Defense in depth on both edges: if the frontend's reverse proxy is ever
  bypassed, the API still sends its own set.

**Trade-offs**
- Still no CSP. Documented; follow-up ADR + report-only rollout.
- `X-Frame-Options: DENY` forecloses embedding WadeCV anywhere — fine today
  (we don't), but a future "embed your CV on LinkedIn" feature would need
  to loosen this to `ALLOW-FROM` or a CSP `frame-ancestors` directive.

## Alternatives considered

- **Reverse-proxy-only** (set headers on App Service / Cloudflare) — fewer
  moving parts, but zero cross-stack visibility for reviewers reading the
  repo, and breaks as soon as a request bypasses the proxy (local dev,
  direct-to-container probes).
- **Full CSP now** — correct eventual state, but blowing up Stripe
  Checkout with a bad directive is a worse Series A signal than no CSP at
  all. Gated behind its own ADR.
