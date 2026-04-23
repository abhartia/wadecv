"use client";

import { useAnalyticsConsent } from "@/lib/consent/analytics-consent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AnalyticsBanner() {
  const { consent, setAnalyticsConsent } = useAnalyticsConsent();

  if (consent !== "pending") return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Analytics & cookies</p>
          <p className="text-xs text-muted-foreground">
            We use Google Analytics to understand how WadeCV is used so we can improve it. You can
            change your choice at any time in the privacy settings.
          </p>
          <p className="text-xs text-muted-foreground">
            See our{" "}
            <Link href="/legal/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </div>
        <div className="flex gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setAnalyticsConsent(false)}
          >
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setAnalyticsConsent(true)}
          >
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
