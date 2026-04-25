import { test, expect } from "@playwright/test";

/**
 * Minimal smoke suite — covers the "did the app even start" baseline so CI
 * catches breaks that unit tests can't see (layout crashes, hydration errors,
 * wiring bugs between Providers and the router).
 */

test("landing page renders and echoes a request id", async ({ page, request }) => {
  await page.goto("/");
  // Page must render something. The exact copy will change; assert on a stable
  // anchor that's unlikely to be retired.
  await expect(page).toHaveTitle(/WadeCV/i);

  // Health endpoint must also echo our correlation header.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const res = await request.get(`${apiUrl}/api/health`, {
    headers: { "X-Request-ID": "playwright-smoke" },
  });
  expect(res.status()).toBe(200);
  expect(res.headers()["x-request-id"]).toBe("playwright-smoke");
});

test("app has no uncaught console errors on the landing page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Allow known noisy console.warn (deprecation notices) but fail on errors.
  expect(errors, `console errors: ${errors.join(" | ")}`).toEqual([]);
});

test("landing page serves baseline security headers", async ({ request }) => {
  const res = await request.get("/");
  expect(res.status()).toBe(200);
  const headers = res.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");

  // Permissions-Policy must lock down FLoC / topics + powerful APIs.
  const pp = headers["permissions-policy"] ?? "";
  for (const directive of ["camera=()", "microphone=()", "browsing-topics=()"]) {
    expect(pp, `expected ${directive}`).toContain(directive);
  }

  // HSTS is already present from a prior commit; re-asserting pins the policy.
  expect(headers["strict-transport-security"]).toMatch(/max-age=\d+/);
});
