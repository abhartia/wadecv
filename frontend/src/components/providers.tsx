"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GAProvider } from "@/components/analytics/ga-provider";
import { AnalyticsConsentProvider } from "@/lib/consent/analytics-consent";
import { AnalyticsBanner } from "@/components/consent/analytics-banner";

export function Providers({ children }: { children: React.ReactNode }) {
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
