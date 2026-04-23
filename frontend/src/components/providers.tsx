"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GAProvider } from "@/components/analytics/ga-provider";
import { AnalyticsConsentProvider } from "@/lib/consent/analytics-consent";
import { AnalyticsBanner } from "@/components/consent/analytics-banner";
import { initSentryClient } from "@/lib/sentry";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Client-side Sentry init. No-op without NEXT_PUBLIC_SENTRY_DSN.
    void initSentryClient();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <TooltipProvider>
          <AnalyticsConsentProvider>
            {children}
            <GAProvider />
            <AnalyticsBanner />
          </AnalyticsConsentProvider>
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
