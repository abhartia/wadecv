from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth, cv, jobs, credits, cover_letter, webhook, account

settings = get_settings()

app = FastAPI(
    title="WadeCV API",
    description="AI-powered CV tailoring system",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(cv.router, prefix="/api/cv", tags=["CV"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(credits.router, prefix="/api/credits", tags=["Credits"])
app.include_router(cover_letter.router, prefix="/api/cover-letter", tags=["Cover Letter"])
app.include_router(webhook.router, prefix="/api/webhook", tags=["Webhooks"])
app.include_router(account.router, prefix="/api/account", tags=["Account"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "WadeCV API"}
