import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "./security-headers";

describe("SECURITY_HEADERS", () => {
  const byKey = new Map(SECURITY_HEADERS.map((h) => [h.key, h.value]));

  it("enforces HTTPS for 2 years with includeSubDomains + preload", () => {
    const hsts = byKey.get("Strict-Transport-Security");
    expect(hsts).toBeDefined();
    expect(hsts).toMatch(/max-age=\d+/);
    const maxAge = Number(hsts!.match(/max-age=(\d+)/)![1]);
    // 1 year minimum, 2 years is our current value
    expect(maxAge).toBeGreaterThanOrEqual(31536000);
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });

  it("disables MIME sniffing", () => {
    expect(byKey.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("blocks framing (clickjacking)", () => {
    expect(byKey.get("X-Frame-Options")).toBe("DENY");
  });

  it("sets strict-origin-when-cross-origin referrer policy", () => {
    expect(byKey.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
  });

  it("denies powerful web APIs we never use and neutralises topics/FLoC", () => {
    const pp = byKey.get("Permissions-Policy");
    expect(pp).toBeDefined();
    // Each directive must be explicitly disabled.
    for (const directive of [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "usb=()",
      "browsing-topics=()",
      "interest-cohort=()",
    ]) {
      expect(pp, `expected ${directive} in Permissions-Policy`).toContain(directive);
    }
  });

  it("isolates the top-level context from cross-origin openers", () => {
    expect(byKey.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
  });

  it("contains no duplicate keys", () => {
    const keys = SECURITY_HEADERS.map((h) => h.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
