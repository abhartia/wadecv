"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/sentry";

/**
 * Root-level error boundary. Fires when the error boundary in error.tsx
 * ITSELF throws, or when the root layout errors before any provider mounts.
 * Must render its own <html> / <body> because the normal layout hasn't run.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest, boundary: "global" });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "2rem",
          maxWidth: "32rem",
          margin: "4rem auto",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.5rem", color: "#666" }}>
          The application hit a fatal error. Please refresh the page.
        </p>
        {error.digest && (
          <p style={{ marginTop: "0.5rem", fontFamily: "monospace", fontSize: "0.75rem" }}>
            Reference: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            background: "#0a0a0a",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
