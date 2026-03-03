export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-PMFGCTZ0B0";

export function isAnalyticsEnabled() {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (!GA_MEASUREMENT_ID) return false;
  return true;
}


