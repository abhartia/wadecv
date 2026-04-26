# Architecture

High-level topology, request flow, and schema snapshot. If something in here
contradicts the code, the code wins — open a PR.

## System topology

```mermaid
flowchart TB
    subgraph User
        B[Browser]
    end

    subgraph "Azure App Service — wadecv (frontend)"
        FE[Next.js 16 container<br/>staging slot + production slot]
    end

    subgraph "Azure App Service — wadecv-backend"
        BE[FastAPI container<br/>staging slot + production slot]
    end

    subgraph "Azure Flexible Server"
        DB[(Postgres 16<br/>users · cvs · jobs · credits · feature_flags)]
    end

    subgraph "Azure Container Registry"
        ACR[ACR images<br/>wadecv-frontend · wadecv-backend]
    end

    subgraph Third-party
        AOAI[Azure OpenAI]
        ST[Stripe]
        RS[Resend]
        LOB[Lob]
        SEN[Sentry]
        LF[Langfuse]
    end

    B -->|HTTPS| FE
    FE -->|HTTPS + JWT bearer| BE
    BE -->|asyncpg pool| DB
    BE --> AOAI
    BE --> ST
    BE --> RS
    BE --> LOB
    BE -->|errors / traces| SEN
    FE -->|errors| SEN
    BE -->|LLM traces| LF

    GH[GitHub Actions] -->|docker push| ACR
    GH -->|slot deploy + swap| FE
    GH -->|slot deploy + swap| BE
```

## Request flow: "generate a tailored CV"

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Next.js
    participant BE as FastAPI
    participant DB as Postgres
    participant LLM as Azure OpenAI

    U->>FE: paste job URL + click Generate
    FE->>BE: POST /api/jobs/scrape (hey-api client)
    BE->>DB: create Job row
    BE->>BE: fetch + parse job description
    BE-->>FE: Job id

    FE->>BE: POST /api/cv/generate (SSE)
    BE->>DB: decrement credits (txn)
    BE->>LLM: streaming chat completion
    LLM-->>BE: token stream
    BE-->>FE: text/event-stream tokens
    FE-->>U: render progressively
    BE->>DB: persist final CV + usage row
```

## Data model (current)

```mermaid
erDiagram
    users ||--o{ cvs : "has many"
    users ||--o{ jobs : "has many"
    users ||--o{ credit_transactions : "has many"
    users ||--o{ magic_links : "has many"
    users ||--o{ physical_mails : "has many"
    jobs ||--o{ cvs : "tailored for"
    jobs ||--o| cover_letters : "has one"
    jobs ||--o{ physical_mails : "sent for"

    users {
        uuid id PK
        string email UK
        string password_hash
        bool email_verified
        int credits
        text base_cv_content
        jsonb gap_insights
        jsonb mailing_address
        timestamp created_at
        timestamp deleted_at
    }
    cvs { uuid id PK  uuid user_id FK  uuid job_id FK  jsonb data  timestamp created_at }
    jobs { uuid id PK  uuid user_id FK  string url  string status  text description }
    credit_transactions { uuid id PK  uuid user_id FK  int amount  string type }
    feature_flags { string name PK  bool enabled  int rollout_pct  jsonb user_allowlist }
```

## Deploy topology

- Backend: `wadecv-backend.azurewebsites.net` with `staging` and production slots.
- Frontend: `wadecv.com` fronted by App Service with `staging` and production slots.
- Migrations: run as a one-off `alembic upgrade head` step in CI against a
  Postgres service container on every PR, and against prod as part of the
  backend deploy job (before the slot swap).
- Secrets: Azure App Service config, never committed. `gitleaks` blocks
  commits that contain tokens.

## Observability

| Signal | Where | Tool |
|--------|-------|------|
| Exceptions (backend) | FastAPI + background tasks | Sentry (env-gated) |
| Exceptions (frontend) | Next.js app router | Sentry (env-gated) |
| Structured logs | Every request / service call | `structlog` JSON → Azure Log Stream |
| Request correlation | `X-Request-ID` header, propagated into every log line | Middleware |
| LLM traces | Every Azure OpenAI call | Langfuse |
| Rate-limit rejections | 429 responses | `slowapi` + logs |

## Security response headers

Applied at both edges of the stack — see [ADR 0004](adr/0004-security-headers.md)
for the full rationale per header. Frontend baseline lives in
[`frontend/src/lib/security-headers.ts`](../frontend/src/lib/security-headers.ts)
(locked by Vitest + Playwright); backend baseline is
`SecurityHeadersMiddleware` in
[`backend/app/middleware/security_headers.py`](../backend/app/middleware/security_headers.py)
(locked by `backend/tests/api/test_security_headers.py`).

| Header | Value | Edges |
|--------|-------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Frontend always; backend in production only |
| `X-Content-Type-Options` | `nosniff` | Both |
| `X-Frame-Options` | `DENY` | Both |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Both |
| `Permissions-Policy` | camera/mic/geo/usb/topics/FLoC denied; `payment=(self)` on the frontend for Stripe | Both |
| `Cross-Origin-Opener-Policy` | `same-origin` | Both |
| `Cross-Origin-Resource-Policy` | `same-site` | Backend (API responses) |

Not yet set: `Content-Security-Policy`. A meaningful CSP for this app needs a
nonce-based middleware pass (Next inline hydration script, GA4, Sentry ingest,
Stripe.js, Lob). Tracked as a separate ADR-worthy change.

## Webhook authentication

| Source | Verification | Where |
|--------|--------------|-------|
| Stripe | `stripe.Webhook.construct_event` (HMAC + timestamp) | [`backend/app/routers/webhook.py`](../backend/app/routers/webhook.py) — see [ADR 0005](adr/0005-stripe-webhook-idempotency.md) |
| Resend (Svix) | Stdlib HMAC-SHA256, 5-min replay window, rotation-aware | [`backend/app/utils/svix_signature.py`](../backend/app/utils/svix_signature.py) — see [ADR 0006](adr/0006-resend-webhook-signature-verification.md) |

Both inbound integrations authenticate at the edge before the handler does
any work. Production refuses to boot if either secret is missing.

## Scaling limits known today

- **Pool size** is `settings.db_pool_size` (default 10) + `max_overflow=20`
  per backend instance. At current traffic, one instance handles load with
  headroom. Bump via env var; no code change.
- **Streaming endpoint** holds a worker per concurrent generation for 10–30s.
  At ~50 concurrent users we'd add a second instance; at ~500 we'd move
  generation to a queue (Celery + RQ already considered, deferred).
- **Stripe webhook** is synchronous — acceptable at current volume. Would move
  to a queue-backed handler before a Series-A launch event.
