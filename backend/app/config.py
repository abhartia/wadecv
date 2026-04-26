from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "WadeCV"
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False

    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://wadecv:wadecv@localhost:5432/wadecv",
        description="Async SQLAlchemy URL. Must use the asyncpg driver.",
    )
    db_pool_size: int = Field(default=10, ge=1, le=100)
    db_max_overflow: int = Field(default=20, ge=0, le=200)
    db_pool_recycle_seconds: int = Field(default=300, ge=30)

    # Auth
    jwt_secret_key: str = Field(
        default="dev-only-change-me-not-for-production",
        min_length=16,
        description="HMAC secret for JWTs. Required in staging/production.",
    )
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=15, ge=1, le=60)
    refresh_token_expire_days: int = Field(default=7, ge=1, le=90)
    magic_link_expire_minutes: int = Field(default=15, ge=1, le=60)

    # Azure OpenAI
    azure_openai_endpoint: str = ""
    azure_openai_api_key: str = ""
    azure_openai_deployment: str = "GPT5Mini"
    azure_openai_api_version: str = "2024-12-01-preview"

    # Langfuse
    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    langfuse_host: str = "https://cloud.langfuse.com"

    # Stripe
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    # Email (Resend)
    email_api_key: str = ""
    email_from: str = "WadeCV <noreply@wadecv.com>"
    support_forward_to: str = Field(
        default="",
        description="Forwarding address for support emails. Required in production.",
    )
    resend_webhook_secret: str = Field(
        default="",
        description=(
            "Svix-format secret (`whsec_...`) for Resend inbound webhook "
            "signature verification. Required in production. Empty in dev "
            "skips verification so docker compose works zero-config."
        ),
    )

    # Lob (physical mail)
    lob_api_key: str = ""

    # URLs
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"

    # Observability
    sentry_dsn: str = Field(
        default="",
        description="Empty = Sentry disabled (no-op). App starts cleanly without a DSN.",
    )
    sentry_traces_sample_rate: float = Field(default=0.1, ge=0.0, le=1.0)
    sentry_profiles_sample_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    log_json: bool = Field(
        default=True,
        description="Emit structlog JSON. Turn off locally if you prefer human-readable logs.",
    )

    # Rate limits (requests per minute)
    rate_limit_default_per_minute: int = Field(default=60, ge=1)
    rate_limit_auth_per_minute: int = Field(default=5, ge=1)
    rate_limit_cv_generate_per_minute: int = Field(default=10, ge=1)

    model_config = {"env_file": ".env", "extra": "ignore"}

    @field_validator("database_url")
    @classmethod
    def _require_async_driver(cls, v: str) -> str:
        if not v.startswith("postgresql+asyncpg://") and not v.startswith("sqlite+aiosqlite://"):
            raise ValueError("database_url must use an async driver (postgresql+asyncpg://...).")
        return v

    def enforce_production_requirements(self) -> None:
        """Fail fast at app start if production is missing critical secrets.

        Dev defaults are deliberately permissive so `docker compose up` works
        with zero configuration. Production must provide every secret.
        """
        if self.environment != "production":
            return
        missing: list[str] = []
        if self.jwt_secret_key == "dev-only-change-me-not-for-production":
            missing.append("jwt_secret_key")
        if not self.support_forward_to:
            missing.append("support_forward_to")
        if not self.stripe_secret_key:
            missing.append("stripe_secret_key")
        if not self.azure_openai_api_key:
            missing.append("azure_openai_api_key")
        if not self.resend_webhook_secret:
            # The inbound-support webhook is publicly addressable; in
            # production we refuse to start without HMAC verification.
            missing.append("resend_webhook_secret")
        if missing:
            raise RuntimeError(f"Missing required production settings: {', '.join(missing)}")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.enforce_production_requirements()
    return settings
