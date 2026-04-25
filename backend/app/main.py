"""FastAPI app factory.

Wires together:
  * observability (Sentry SDK, structlog JSON, request-ID middleware)
  * rate limiting (slowapi, keyed by JWT sub when present, IP otherwise)
  * CORS
  * routers

Sentry is gated on `settings.sentry_dsn` — an empty DSN means the SDK isn't
initialised at all and the app starts cleanly. That keeps the clone-and-run
path usable for reviewers without a Sentry account.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.config import get_settings
from app.logging_config import configure_logging, get_logger
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.routers import (
    account,
    auth,
    cover_letter,
    credits,
    cv,
    feature_flags,
    jobs,
    physical_mail,
    webhook,
)

settings = get_settings()

configure_logging(level=settings.log_level, json_output=settings.log_json)
log = get_logger(__name__)

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        traces_sample_rate=settings.sentry_traces_sample_rate,
        profiles_sample_rate=settings.sentry_profiles_sample_rate,
        integrations=[StarletteIntegration(), FastApiIntegration()],
        send_default_pii=False,
    )
    log.info("sentry_enabled", environment=settings.environment)
else:
    log.info("sentry_disabled", reason="SENTRY_DSN not set")


def _rate_limit_key(request: Request) -> str:
    """Key by authenticated user id if we can cheaply extract it, else IP.

    We don't decode the JWT here (middleware runs before auth), but we hash the
    bearer token so per-user limits apply even before the dependency resolves.
    """
    auth_header = request.headers.get("authorization", "")
    if auth_header.lower().startswith("bearer "):
        return f"user:{hash(auth_header[7:]) & 0xFFFFFFFF:08x}"
    return f"ip:{get_remote_address(request)}"


limiter = Limiter(
    key_func=_rate_limit_key,
    default_limits=[f"{settings.rate_limit_default_per_minute}/minute"],
    headers_enabled=True,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    log.info(
        "app_started",
        environment=settings.environment,
        sentry=bool(settings.sentry_dsn),
        pool_size=settings.db_pool_size,
    )
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.debug else logging.WARNING
    )
    yield
    log.info("app_stopped")


app = FastAPI(
    title="WadeCV API",
    description="AI-powered CV tailoring system",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware runs in REVERSE order of registration. We want, outermost → innermost:
#   RequestID → SecurityHeaders → SlowAPI → app
# so request ids are minted first, security headers land on every response
# (including 429s), and rate-limit headers are added last.
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    SecurityHeadersMiddleware,
    enable_hsts=settings.environment == "production",
)
app.add_middleware(RequestIDMiddleware)

allowed_origins = [
    settings.frontend_url,
    "https://wadecv.com",
    "https://www.wadecv.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-Request-ID"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(cv.router, prefix="/api/cv", tags=["CV"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(credits.router, prefix="/api/credits", tags=["Credits"])
app.include_router(cover_letter.router, prefix="/api/cover-letter", tags=["Cover Letter"])
app.include_router(webhook.router, prefix="/api/webhook", tags=["Webhooks"])
app.include_router(account.router, prefix="/api/account", tags=["Account"])
app.include_router(physical_mail.router, prefix="/api/mail", tags=["Physical Mail"])
app.include_router(feature_flags.router, prefix="/api/feature-flags", tags=["Feature Flags"])


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "WadeCV API"}
