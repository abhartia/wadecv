/**
 * Baseline HTTP security response headers applied to every route by
 * `next.config.ts`.
 *
 * Kept in a standalone module so the set can be asserted from unit tests
 * without booting Next, and so a reviewer has a single file to audit.
 *
 * Deliberately NOT set here:
 *   - Content-Security-Policy. A useful CSP for this app needs a nonce-based
 *     middleware pass (Next inline `<script>` for hydration, GA4 at
 *     www.googletagmanager.com, Sentry ingest, Stripe.js, Lob, Resend). That
 *     is its own change with its own ADR — see follow-ups in the PR body.
 */

export type SecurityHeader = { key: string; value: string };

export const SECURITY_HEADERS: readonly SecurityHeader[] = [
  // Pin HTTPS for 2 years incl. subdomains; preload-ready.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disable MIME sniffing — blocks content-type confusion attacks on uploads
  // and generated docx/pdf downloads.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block clickjacking. We have no legitimate embed surface.
  { key: "X-Frame-Options", value: "DENY" },
  // Send origin-only on cross-origin nav; full URL same-origin. Strips query
  // strings (which can carry job URLs / emails on share links) from referrers.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny powerful APIs we never use; neutralise FLoC / topics by default.
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=(self)",
      "usb=()",
      "browsing-topics=()",
      "interest-cohort=()",
    ].join(", "),
  },
  // Isolate our top-level browsing context from cross-origin openers so
  // `window.opener` attacks and Spectre-style cross-origin leaks are blocked.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
