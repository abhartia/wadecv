"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { detectRegion, isGpcEnabled, type ConsentRegion } from "./region";

export type ConsentState = "granted" | "denied" | "pending";

type AnalyticsConsentContextValue = {
  consent: ConsentState;
  region: ConsentRegion | null;
  setAnalyticsConsent: (value: boolean) => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | undefined>(undefined);

const STORAGE_KEY = "wadecv_analytics_consent";

function readStored(): "true" | "false" | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "true" || v === "false") return v;
  } catch {
    // ignore
  }
  return null;
}

export function AnalyticsConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>("denied");
  const [region, setRegion] = useState<ConsentRegion | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectedRegion = detectRegion();
    setRegion(detectedRegion);

    if (isGpcEnabled()) {
      setConsent("denied");
      return;
    }

    const stored = readStored();
    if (stored === "true") {
      setConsent("granted");
      return;
    }
    if (stored === "false") {
      setConsent("denied");
      return;
    }

    // No explicit choice yet.
    if (detectedRegion === "EEA_UK") {
      setConsent("pending");
    } else {
      setConsent("granted");
    }
  }, []);

  const setAnalyticsConsent = (value: boolean) => {
    setConsent(value ? "granted" : "denied");
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    } catch {
      // ignore
    }
  };

  return (
    <AnalyticsConsentContext.Provider value={{ consent, region, setAnalyticsConsent }}>
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
