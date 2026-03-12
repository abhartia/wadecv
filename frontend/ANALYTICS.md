# Analytics & tracking in WadeCV frontend

This document explains how Google Analytics is wired into the frontend and how to add or update tracking.

## Overview

- Google Analytics 4 (GA4) is loaded via `gtag.js`.
- Tracking is **production-only** and controlled by `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- A consent banner controls whether non-essential analytics events are sent.

## Configuration

- Measurement ID is read from `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Helper: `src/lib/analytics.ts`
  - `GA_MEASUREMENT_ID`
  - `isAnalyticsEnabled()` – guards all GA usage.

Global scripts are injected by:

- `src/components/analytics/ga-provider.tsx`
- Mounted in `src/components/providers.tsx` inside `AnalyticsConsentProvider`.

## Consent

- Consent state is managed by `src/lib/consent/analytics-consent.tsx`.
- UI banner: `src/components/consent/analytics-banner.tsx`.
- Until the user accepts analytics, `gtag` is not initialised and helper calls are no-ops.

## Pageviews

- Hook: `src/lib/analytics/usePageview.tsx`
- Listener: `src/components/analytics/pageview-listener.tsx`
- Mounted in `src/app/(dashboard)/layout.tsx` to track dashboard route changes.

## Events

- Low-level helpers: `src/lib/analytics/gtag.ts`
  - `pageview(path)`
  - `trackEvent(name, params?)`
  - `setUserProperties(props)`
- Event-specific helpers: `src/lib/analytics/events.ts`
  - Auth: `trackLoginAttempt`, `trackLoginSuccess`, `trackLoginFailure`, `trackSignup*`
  - CV flow: `trackCvImport*`, `trackCvSectionEdited`, `trackCvTailorStarted`, `trackCvTailorApplied`, `trackCvDownload`, `trackCvEmailSent`
  - Engagement: `trackDashboardViewed`, `trackEditorOpened`, `trackFeatureClicked`, job scrape events
  - SEO: `trackSeoCtaClick(variant, slug?)`, `trackSeoNavClick(link)` – fired from Resources CTAs and navbar/footer links
  - Errors: `trackFrontendError`, `trackApiCallFailed`

### Existing wiring

- `auth/login` page:
  - Calls login attempt/success/failure events.
- `tailor` page:
  - Tracks dashboard view, CV uploads, job scraping, generation, saving, and downloads.
- `CVEditor`:
  - Tracks section edits per top-level CV section.

## How to add a new event

1. Add a helper in `src/lib/analytics/events.ts`, calling `trackEvent` with a new name.
2. Call the helper from the relevant component (e.g. button click handler).
3. Keep names `snake_case` and include useful params (strings/numbers/booleans).

## Local testing

- Set `NEXT_PUBLIC_ANALYTICS_DEBUG=true` to log GA calls in the browser console instead of sending real hits (in addition to any real calls in production).
- In production, open GA real-time view and exercise key flows:
  - Login success/failure
  - Tailor CV flow (upload/import, generate, edit, download)
  - Cover letter generation and downloads

