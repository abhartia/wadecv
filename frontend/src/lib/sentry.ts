/**
 * Thin Sentry wrapper. Gated on NEXT_PUBLIC_SENTRY_DSN — every function is a
 * safe no-op when the DSN is empty, so the app runs cleanly without a Sentry
 * account. Importing `@sentry/nextjs` is cheap; not initialising it leaves
 * the SDK silent.
 */

export const sentryEnabled = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export async function initSentryClient() {
  if (!sentryEnabled) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
    environment: process.env.NEXT_PUBLIC_APP_URL?.includes("localhost")
      ? "development"
      : "production",
  });
}

export async function captureException(error: unknown, context?: Record<string, unknown>) {
  if (!sentryEnabled) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureException(error, { extra: context });
}
