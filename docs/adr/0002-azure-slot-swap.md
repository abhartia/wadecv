# ADR 0002 — Zero-downtime deploys via Azure slot swap

**Status:** Accepted · **Date:** 2026-03-15

## Context

WadeCV runs on Azure App Service for Containers. Deploys need to be
zero-downtime because:

- CV generation is a long-running SSE stream; cutting a live request mid-flight
  is a bad UX.
- Stripe webhooks arrive at unpredictable times and must not 502 during a deploy.

The project is still solo — Kubernetes + blue/green with a service mesh is
overkill. We need the simplest thing that gives us atomic cutover.

## Decision

Use Azure App Service **deployment slots**:

1. CI pushes the image to ACR.
2. Deploy the new image to the `staging` slot (App Service pulls and warms it).
3. Run smoke checks against the staging slot URL.
4. `az webapp deployment slot swap --slot staging --target-slot production`.

Swap is an atomic DNS/LB change; in-flight requests on the old slot continue
to drain until they complete.

Applies to both the FastAPI backend and the Next.js frontend.

## Consequences

**Good**
- Zero-downtime without managing a Kubernetes control plane.
- Built-in rollback: swap again, old slot becomes live.
- Each slot has its own config, so secrets / env vars rotate cleanly.

**Trade-offs**
- One extra slot per app = ~2x the cost of a single App Service plan. At
  Series-A scale this is a rounding error; budget-aware alternatives exist
  but aren't worth the complexity yet.
- Database migrations are NOT atomic with the swap. We follow the
  expand-migrate-contract pattern: any schema change must be backward
  compatible with the previous image, shipped in two deploys if necessary.
- Slot swap doesn't warm up per-process caches. Cold-start is mitigated by
  the platform's "warm up" preload, which we leave on defaults.

## Alternatives considered

- **Single-slot deploys with restart** — 30–60s of 502s. Rejected.
- **Kubernetes + Argo Rollouts** — correct long-term answer, but the team
  size doesn't justify the operational surface today. Revisit post-seed.
- **Container Apps with revisions** — viable alternative; we stayed on App
  Service to avoid migrating the existing infra mid-stream.
