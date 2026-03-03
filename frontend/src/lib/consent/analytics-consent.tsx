"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AnalyticsConsentContextValue = {
  hasAnalyticsConsent: boolean | null;
  setAnalyticsConsent: (value: boolean) => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | undefined>(undefined);

const STORAGE_KEY = "wadecv_analytics_consent";

export function AnalyticsConsentProvider({ children }: { children: React.ReactNode }) {
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      queueMicrotask(() => {
        if (stored === "true") setHasAnalyticsConsent(true);
        if (stored === "false") setHasAnalyticsConsent(false);
      });
    } catch {
      // ignore
    }
  }, []);

  const setAnalyticsConsent = (value: boolean) => {
    setHasAnalyticsConsent(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch {
      // ignore
    }
  };

  return (
    <AnalyticsConsentContext.Provider value={{ hasAnalyticsConsent, setAnalyticsConsent }}>
      {children}
    </AnalyticsConsentContext.Provider>
  );
}

export function useAnalyticsConsent() {
  const ctx = useContext(AnalyticsConsentContext);
  if (!ctx) {
    throw new Error("useAnalyticsConsent must be used within AnalyticsConsentProvider");
  }
  return ctx;
}

