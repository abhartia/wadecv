"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { detectRegion, isGpcEnabled, type ConsentRegion } from "./region";

export type ConsentState = "granted" | "denied" | "pending";

type Snapshot = {
  consent: ConsentState;
  region: ConsentRegion | null;
  gpc: boolean;
};

const STORAGE_KEY = "wadecv_analytics_consent";
const SERVER_SNAPSHOT: Snapshot = { consent: "denied", region: null, gpc: false };

let initialized = false;
let state: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function readStored(): "true" | "false" | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "true" || v === "false") return v;
  } catch {
    // ignore
  }
  return null;
}

function computeInitialSnapshot(): Snapshot {
  const region = detectRegion();
  const gpc = isGpcEnabled();

  if (gpc) return { consent: "denied", region, gpc };

  const stored = readStored();
  if (stored === "true") return { consent: "granted", region, gpc };
  if (stored === "false") return { consent: "denied", region, gpc };

  return {
    consent: region === "EEA_UK" ? "pending" : "granted",
    region,
    gpc,
  };
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  state = computeInitialSnapshot();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Snapshot {
  ensureInitialized();
  return state;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

function writeConsent(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
  } catch {
    // ignore
  }
  state = { ...state, consent: value ? "granted" : "denied" };
  emit();
}

type AnalyticsConsentContextValue = {
  consent: ConsentState;
  region: ConsentRegion | null;
  gpc: boolean;
  setAnalyticsConsent: (value: boolean) => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | undefined>(undefined);

export function AnalyticsConsentProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <AnalyticsConsentContext.Provider
      value={{
        consent: snapshot.consent,
        region: snapshot.region,
        gpc: snapshot.gpc,
        setAnalyticsConsent: writeConsent,
      }}
    >
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
