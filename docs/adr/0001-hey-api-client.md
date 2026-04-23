# ADR 0001 — Generated API client with hey-api

**Status:** Accepted · **Date:** 2026-04-01

## Context

The frontend needs to call ~40 FastAPI endpoints. Each endpoint has a Pydantic
request and response schema that already serializes to OpenAPI. A hand-written
`api.ts` has two failure modes we want to eliminate:

1. **Silent drift.** A backend rename ships; the frontend still sends the old
   field name. Compiles green, 422s at runtime.
2. **Duplicate types.** `CVGenerateResponse` is defined on both sides and has
   to be kept in sync manually.

## Decision

Use [`@hey-api/openapi-ts`](https://heyapi.dev/) to generate a typed client
from `backend/openapi.json` into `frontend/src/gen/`. The generated client is
checked into the repo. A CI job regenerates it and fails the build if the diff
is non-empty — OpenAPI drift becomes a red build, not a production incident.

Every new endpoint is consumed through the generated client + TanStack Query.
Hand-rolled `fetch` calls in components are rejected at review time.

## Consequences

**Good**
- End-to-end type safety: Pydantic → OpenAPI → TS types, no hand-duplication.
- The "regenerate" step is a CI gate — drift becomes unmissable.
- Zero maintenance cost per new endpoint.

**Trade-offs**
- Generated code is in git (larger diffs on schema changes). Acceptable: it's
  one `npm run gen:api` away from being reproducible, and diffs make reviews
  better, not worse.
- Adds `@hey-api/openapi-ts` as a build-time dep. Small surface.

## Alternatives considered

- **tRPC** — requires Node on the backend. Not an option (FastAPI).
- **Hand-rolled `api.ts` with Zod** — works but the type duplication is the
  exact problem we're avoiding.
- **OpenAPI Generator** — older, Java-based, produces less idiomatic TS.
