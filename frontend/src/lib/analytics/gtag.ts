import { GA_MEASUREMENT_ID, isAnalyticsEnabled } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type GAEventName =
  | "login_attempt"
  | "login_success"
  | "login_failure"
  | "signup_start"
  | "signup_success"
  | "signup_failure"
  | "cv_import_started"
  | "cv_import_success"
  | "cv_import_failure"
  | "cv_section_edited"
  | "cv_tailor_started"
  | "cv_tailor_applied"
  | "cv_download"
  | "cv_email_sent"
  | "dashboard_viewed"
  | "editor_opened"
  | "job_scrape_started"
  | "job_scrape_success"
  | "job_scrape_failure"
  | "feature_clicked"
  | "frontend_error"
  | "api_call_failed"
  | "seo_cta_click"
  | "seo_nav_click";

export type GAEventParams = Record<string, string | number | boolean | null | undefined>;

const debug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";

function getGtag() {
  if (typeof window === "undefined") return null;
  if (!isAnalyticsEnabled()) return null;
  return window.gtag ?? null;
}

export function pageview(path: string) {
  const gtag = getGtag();
  if (!gtag) {
    if (debug) console.log("[analytics] pageview (noop)", { path });
    return;
  }

  if (debug) console.log("[analytics] pageview", { path });

  gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(name: GAEventName, params?: GAEventParams) {
  const gtag = getGtag();
  if (!gtag) {
    if (debug) console.log("[analytics] event (noop)", { name, params });
    return;
  }

  if (debug) console.log("[analytics] event", { name, params });

  gtag("event", name, params || {});
}

export function setUserProperties(props: GAEventParams) {
  const gtag = getGtag();
  if (!gtag) {
    if (debug) console.log("[analytics] setUserProperties (noop)", props);
    return;
  }

  if (debug) console.log("[analytics] setUserProperties", props);

  gtag("set", "user_properties", props);
}

