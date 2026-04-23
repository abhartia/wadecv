"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { captureException } from "@/lib/sentry";

/**
 * Route-level error boundary. Catches any render error in the app's client
 * tree that isn't handled by a nested error.tsx. Reports to Sentry (no-op
 * without a DSN) and offers a retry via Next's `reset()` callback.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            We hit an unexpected error. The team has been notified.
            {error.digest && (
              <span className="mt-2 block font-mono text-xs opacity-70">
                Reference: {error.digest}
              </span>
            )}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
