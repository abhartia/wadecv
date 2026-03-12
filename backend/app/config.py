from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "WadeCV"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://wadecv:wadecv@localhost:5432/wadecv"

    # Auth
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    magic_link_expire_minutes: int = 15

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
    support_forward_to: str = "bhartta@gmail.com"

    # URLs
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
