# ADR 0003 — Feature flags in Postgres, not a vendor

**Status:** Accepted · **Date:** 2026-04-23

## Context

We need a way to gate in-progress features and do percentage rollouts without
re-deploying. The canonical answers are LaunchDarkly, Statsig, or GrowthBook.

All three cost money at meaningful volume (LaunchDarkly starts at ~$10/seat,
GrowthBook self-hosted needs a Mongo cluster). The repo is a solo portfolio
project; we don't have a flag budget and we don't need multi-environment
targeting, experiment analysis, or audit logs.

## Decision

Flags live in a `feature_flags` table in the existing Postgres. Fields:

- `name` (unique string)
- `enabled` (bool, global kill switch)
- `rollout_pct` (int 0–100, hashed on user id for stability)
- `user_allowlist` (JSONB array of user ids — always-on overrides)

Backend: `flag_enabled(name)` FastAPI dependency resolves at request time,
using the authenticated user's id (or IP hash for anonymous requests).

Frontend: `useFeatureFlag(name)` TanStack Query hook hits
`GET /api/feature-flags/{name}` and caches for 60s.

## Consequences

**Good**
- Zero additional vendor cost.
- Evaluations are one indexed Postgres lookup — negligible latency.
- Flag values are visible in the same DB as everything else; one place to query.
- Swapping to LaunchDarkly later is a one-file change: replace the
  `flag_enabled` dependency's implementation.

**Trade-offs**
- No UI for toggling; flags flip via `UPDATE feature_flags SET enabled = ...`.
  Acceptable at current scale; a tiny admin page is the obvious next step
  when it stops being acceptable.
- No experiment analysis, no multi-variant flags. Out of scope for this stage.
- Clients see stale values for up to 60s after a flip. Documented; fine.

## Alternatives considered

- **LaunchDarkly / Statsig** — paid. Deferred until it matters.
- **GrowthBook self-hosted** — free, but adds Mongo + Docker service. More
  operational surface than the value at our scale.
- **Env-var gating** — requires a deploy per flip. Defeats the purpose.
