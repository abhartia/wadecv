"""Attach a conservative set of security response headers to every response.

The FastAPI app is consumed by the Next.js frontend (which sets its own
headers in `next.config.ts`) and — thanks to CORS — directly from browsers.
Even though API responses are JSON, browsers still honour headers like
`X-Content-Type-Options` and `X-Frame-Options` defensively, and they're the
first thing a security reviewer greps for.

HSTS is production-only so that local http://localhost:8000 dev traffic
doesn't pin the browser to HTTPS on the dev port. Browsers ignore HSTS on
non-HTTPS responses anyway; gating on environment just keeps the wire clean.

Rationale for each header is in `docs/adr/0004-security-headers.md`.
"""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

# Static headers applied to every response. Keep this list short and
# uncontroversial — anything that could break a legitimate use case
# (e.g. a strict CSP) belongs behind a config flag instead.
_STATIC_HEADERS: dict[str, str] = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": (
        "accelerometer=(), camera=(), geolocation=(), gyroscope=(), "
        "magnetometer=(), microphone=(), payment=(), usb=(), "
        "interest-cohort=(), browsing-topics=()"
    ),
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
}

_HSTS_VALUE = "max-age=63072000; includeSubDomains; preload"


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, *, enable_hsts: bool) -> None:
        super().__init__(app)
        self._enable_hsts = enable_hsts

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        for name, value in _STATIC_HEADERS.items():
            response.headers.setdefault(name, value)
        if self._enable_hsts:
            response.headers.setdefault("Strict-Transport-Security", _HSTS_VALUE)
        return response
