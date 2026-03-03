# WadeCV

AI-powered CV tailoring system. Upload your CV, paste a job link, and get a professionally crafted resume tailored to the role in seconds.

## Features

- **AI CV Generation** -- Tailors your existing CV for specific job descriptions using Azure OpenAI (GPT-5-nano)
- **Job URL Scraping** -- Automatically extracts job descriptions from LinkedIn, Indeed, Greenhouse, Lever, and more
- **Cover Letter Generation** -- Free AI-generated cover letters for every tailored CV
- **Online CV Editor** -- Edit generated CVs section-by-section before downloading
- **DOCX Export** -- Download professionally formatted Word documents
- **Application Tracker** -- Track all your job applications in one place
- **Credit System** -- Pay-per-use pricing with Stripe integration
- **Dark Mode** -- Full dark mode support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python 3.12, SQLAlchemy, Alembic |
| Database | PostgreSQL (Azure Flexible Server) |
| AI | Azure OpenAI (GPT-5-nano), Langfuse |
| Payments | Stripe (Checkout Sessions) |
| Email | Resend |
| Hosting | Azure App Service |

## Project Structure

```
wadecv/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── models/   # SQLAlchemy ORM models
│   │   ├── schemas/  # Pydantic request/response schemas
│   │   ├── routers/  # API route handlers
│   │   ├── services/ # Business logic
│   │   └── utils/    # Auth, parsing utilities
│   └── alembic/      # Database migrations
├── frontend/         # Next.js frontend
│   └── src/
│       ├── app/      # App Router pages
│       ├── components/  # React components (shadcn/ui)
│       └── lib/      # API client, auth context
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16+
- Azure OpenAI access
- Stripe account
- Resend account (for email)
- Langfuse account

### 1. Clone and configure

```bash
git clone https://github.com/yourusername/wadecv.git
cd wadecv
cp .env.example .env
# Edit .env with your actual credentials
```

### 2. Start with Docker (recommended)

```bash
docker compose up -d
```

This starts PostgreSQL, the backend (port 8000), and the frontend (port 3000).

### 3. Or run manually

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### 4. Run database migrations

```bash
cd backend
alembic upgrade head
```

### 5. Set up Stripe webhook (for local dev)

```bash
stripe listen --forward-to localhost:8000/api/webhook/stripe
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Email + password login |
| POST | `/api/auth/magic-link` | Request magic link |
| POST | `/api/auth/magic-link/verify` | Verify magic link |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/cv/upload` | Upload CV file |
| POST | `/api/cv/generate` | Generate tailored CV (costs 1 credit) |
| PUT | `/api/cv/{id}` | Update CV data |
| GET | `/api/cv/{id}/download` | Download CV as DOCX |
| GET | `/api/jobs/` | List applications |
| PATCH | `/api/jobs/{id}` | Update application status |
| POST | `/api/jobs/scrape` | Scrape job URL |
| GET | `/api/credits/packs` | List credit packs |
| POST | `/api/credits/checkout` | Create Stripe checkout |
| POST | `/api/cover-letter/generate` | Generate cover letter (free) |
| GET | `/api/cover-letter/{job_id}/download` | Download cover letter as DOCX |
| DELETE | `/api/account/delete` | Delete account and all data |

## Credit Pricing

| Pack | Credits | Price | Per CV |
|------|---------|-------|--------|
| Starter | 10 | $10 | $1.00 |
| Value | 20 | $15 | $0.75 |
| Pro | 50 | $20 | $0.40 |

New users get 1 free credit on signup.

## License

Proprietary. All rights reserved.
