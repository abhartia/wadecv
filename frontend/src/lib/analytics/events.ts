import { trackEvent, GAEventParams } from "@/lib/analytics/gtag";

export function trackLoginAttempt(method: string) {
  trackEvent("login_attempt", { method });
}

export function trackLoginSuccess(method: string) {
  trackEvent("login_success", { method });
}

export function trackLoginFailure(method: string, error_code?: string) {
  trackEvent("login_failure", { method, error_code });
}

export function trackSignupStart(method: string) {
  trackEvent("signup_start", { method });
}

export function trackSignupSuccess(method: string) {
  trackEvent("signup_success", { method });
}

export function trackSignupFailure(method: string, error_code?: string) {
  trackEvent("signup_failure", { method, error_code });
}

export function trackCvImportStarted(source: string) {
  trackEvent("cv_import_started", { source });
}

export function trackCvImportSuccess(source: string) {
  trackEvent("cv_import_success", { source });
}

export function trackCvImportFailure(source: string, error_type?: string) {
  trackEvent("cv_import_failure", { source, error_type });
}

export function trackCvSectionEdited(section_name: string) {
  trackEvent("cv_section_edited", { section_name });
}

export function trackCvTailorStarted() {
  trackEvent("cv_tailor_started");
}

export function trackCvTailorApplied() {
  trackEvent("cv_tailor_applied");
}

export function trackCvDownload(format: string) {
  trackEvent("cv_download", { format });
}

export function trackCvEmailSent(success: boolean, error_type?: string) {
  trackEvent("cv_email_sent", { success, error_type });
}

export function trackDashboardViewed() {
  trackEvent("dashboard_viewed");
}

export function trackEditorOpened() {
  trackEvent("editor_opened");
}

export function trackJobScrapeStarted() {
  trackEvent("job_scrape_started");
}

export function trackJobScrapeSuccess() {
  trackEvent("job_scrape_success");
}

export function trackJobScrapeFailure(error_type?: string) {
  trackEvent("job_scrape_failure", { error_type });
}

export function trackFeatureClicked(feature_name: string, extra?: GAEventParams) {
  trackEvent("feature_clicked", { feature_name, ...extra });
}

export function trackFrontendError(component: string, message: string) {
  trackEvent("frontend_error", { component, message });
}

export function trackApiCallFailed(endpoint: string, status: number) {
  trackEvent("api_call_failed", { endpoint, status });
}

export function trackSeoCtaClick(variant: string, slug?: string) {
  trackEvent("seo_cta_click", { variant, ...(slug ? { slug } : {}) });
}

export function trackSeoNavClick(link: string) {
  trackEvent("seo_nav_click", { link });
}

