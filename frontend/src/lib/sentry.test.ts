import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("sentry wrapper", () => {
  const originalDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalDsn === undefined) delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    else process.env.NEXT_PUBLIC_SENTRY_DSN = originalDsn;
  });

  it("is a no-op when NEXT_PUBLIC_SENTRY_DSN is empty", async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = "";
    const { initSentryClient, captureException, sentryEnabled } = await import("./sentry");
    expect(sentryEnabled).toBe(false);
    // Should complete without throwing and without importing @sentry/nextjs.
    await expect(initSentryClient()).resolves.toBeUndefined();
    await expect(captureException(new Error("boom"))).resolves.toBeUndefined();
  });
});
