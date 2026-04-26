# Runbook

Local dev setup and common failure modes. If you hit something not covered
here, please add it.

## Prerequisites

- Python 3.12+
- Node.js 20+
- Docker (for the Postgres dev DB)
- `pre-commit` (`pip install pre-commit`)

## One-time setup

```bash
git clone https://github.com/abhartia/wadecv.git
cd wadecv

pre-commit install

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit both .env files — only the keys for features you want to exercise
# need real values. Unset SENTRY_DSN / STRIPE_* etc. are all graceful no-ops.
```

## Running locally

### Everything via docker compose

```bash
docker compose up -d
# Postgres: localhost:5432
# Backend:  localhost:8000
# Frontend: localhost:3000
```

### Or piece-by-piece

**Postgres only**

```bash
docker compose up -d postgres
```

**Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm ci
npm run dev
```

## Common commands

| Command | What it does |
|---------|--------------|
| `pre-commit run --all-files` | Lint + format everything as CI sees it |
| `cd backend && pytest --cov` | Backend tests + coverage |
| `cd backend && ruff check . && ruff format --check .` | Backend lint |
| `cd backend && alembic revision --autogenerate -m "message"` | New migration |
| `cd backend && alembic upgrade head` | Apply migrations |
| `cd backend && alembic downgrade -1 && alembic upgrade head` | Verify reversibility |
| `cd frontend && npm run gen:api` | Regenerate hey-api client from `backend/openapi.json` |
| `cd frontend && npm run typecheck` | TS check without emit |
| `cd frontend && npm test` | Vitest unit tests |
| `cd frontend && npx playwright test` | Playwright e2e smoke |

## Failure modes

### "MissingGreenlet" from SQLAlchemy

A relationship is being accessed outside an async context. Either use
`.options(selectinload(Model.relationship))` on the query, or flip the
relationship's `lazy=` on the model.

### Alembic migration fails in CI but works locally

Usually a JSONB default or server-side function that Postgres 16 evaluates
differently from whatever was in your dev image. Check:

```bash
docker run --rm postgres:16 psql --version
alembic upgrade head && alembic downgrade -1 && alembic upgrade head
```

### Resend inbound-support webhook returns 401

The endpoint verifies a Svix HMAC signature. Either the `RESEND_WEBHOOK_SECRET`
env var is wrong/missing on the App Service slot, or the request didn't
come from Resend. Check:

1. Confirm the secret in Resend's dashboard matches the App Service config
   (it's the per-endpoint secret in the form `whsec_<base64>`).
2. Look for `resend_webhook_signature_invalid` in the backend logs — the
   `reason=` tag tells you whether it was a missing header, expired
   timestamp, or a true signature mismatch.
3. In production, an unset secret causes the app to refuse to start with
   `Missing required production settings: resend_webhook_secret`. Add it
   to App Service config and restart.

### Stripe webhook stops working after a deploy

The slot swap changes the public URL's backing container. Confirm the
webhook endpoint is registered against `https://wadecv-backend.azurewebsites.net/api/webhook/stripe`
(not the slot-specific URL). Replay a failed event from the Stripe dashboard.

### CI job `generated-client-sync` is failing

Backend OpenAPI schema changed and the frontend client wasn't regenerated.
Fix:

```bash
cd frontend
npm run gen:api
git add src/gen
git commit -m "chore: regenerate api client"
```

### Sentry isn't receiving errors

Check the env var — the SDK is gated on `SENTRY_DSN` (backend) /
`NEXT_PUBLIC_SENTRY_DSN` (frontend) and no-ops when empty. In prod, App
Service config is the source of truth.

### Rate limiter (429) firing in dev

By design: auth endpoints are 5/min. Raise the limit in `backend/app/config.py`
(`rate_limit_auth_per_minute`) for dev, or exponentially back off in the
client.

## Secret rotation

1. Generate the new secret (Azure Key Vault, Stripe dashboard, etc.).
2. Update the App Service config for the **staging slot** first.
3. Deploy a no-op change (or just restart the staging slot).
4. Smoke-test the staging slot URL.
5. Swap staging → production.
6. Revoke the old secret at the source.

Never commit real values. `gitleaks` runs in CI and will block the PR.
