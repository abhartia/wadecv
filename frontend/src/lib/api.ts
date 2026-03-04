const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "An error occurred" }));
    throw new ApiError(body.detail || "An error occurred", res.status);
  }

  if (res.headers.get("content-type")?.includes("application/json")) {
    return res.json();
  }
  return res as unknown as T;
}

export const api = {
  // Auth
  register: (email: string, password?: string) =>
    request<{ access_token: string; refresh_token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ access_token: string; refresh_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  sendMagicLink: (email: string) =>
    request<{ message: string }>("/api/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyMagicLink: (token: string) =>
    request<{ access_token: string; refresh_token: string }>("/api/auth/magic-link/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  verifyEmail: (token: string) =>
    request<{ message: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  refreshToken: (refreshToken: string) =>
    request<{ access_token: string; refresh_token: string }>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  getMe: (token: string) =>
    request<{
      id: string;
      email: string;
      email_verified: boolean;
      credits: number;
      has_profile: boolean;
      has_password: boolean;
      base_cv_content: string | null;
      additional_info: string | null;
      cv_page_limit: number;
      created_at: string;
    }>("/api/auth/me", { token }),

  logout: () =>
    request("/api/auth/logout", { method: "POST" }),

  // CV
  uploadCV: (file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ id: string; original_filename: string; original_content: string; status: string; created_at: string }>(
      "/api/cv/upload",
      { method: "POST", body: formData, token }
    );
  },

  generateCV: (data: { cv_id?: string; job_id?: string; job_url?: string; job_description?: string; additional_info?: string; page_limit?: 1 | 2 }, token: string) =>
    request<{
      id: string;
      original_filename: string;
      original_content: string;
      additional_info: string | null;
      generated_cv_data: Record<string, unknown>;
      fit_analysis: { fit_score: number; strengths: string[]; gaps: string[] } | null;
      page_limit: number | null;
      job_id: string | null;
      status: string;
      created_at: string;
    }>("/api/cv/generate", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  refineCV: (cvId: string, data: { gap_feedback: Record<string, string> }, token: string) =>
    request<{
      id: string;
      original_filename: string;
      original_content: string;
      additional_info: string | null;
      generated_cv_data: Record<string, unknown>;
      fit_analysis: { fit_score: number; strengths: string[]; gaps: string[] } | null;
      page_limit: number | null;
      job_id: string | null;
      status: string;
      created_at: string;
    }>(`/api/cv/${cvId}/refine`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  updateCV: (cvId: string, data: { generated_cv_data: Record<string, unknown> }, token: string) =>
    request("/api/cv/" + cvId, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  getCV: (cvId: string, token: string) =>
    request<{
      id: string;
      original_filename: string;
      original_content: string;
      additional_info: string | null;
      generated_cv_data: Record<string, unknown> | null;
      fit_analysis: { fit_score: number; strengths: string[]; gaps: string[] } | null;
      page_limit: number | null;
      status: string;
      created_at: string;
    }>("/api/cv/" + cvId, { token }),

  listCVs: (token: string) =>
    request<Array<{ id: string; original_filename: string; status: string; created_at: string; job_title: string | null; company_name: string | null }>>("/api/cv/", { token }),

  downloadCV: (cvId: string, token: string, format: "docx" | "pdf" = "docx") =>
    fetch(`${API_URL}/api/cv/${cvId}/download?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    }),

  // Jobs
  listJobs: (token: string, status?: string) =>
    request<Array<{
      id: string;
      cv_id: string;
      job_url: string | null;
      job_description: string;
      company_name: string | null;
      job_title: string | null;
      application_status: string;
      applied_at: string | null;
      created_at: string;
      fit_score: number | null;
    }>>(`/api/jobs/${status ? `?status_filter=${status}` : ""}`, { token }),

  getJob: (jobId: string, token: string) =>
    request<{
      id: string;
      cv_id: string;
      job_url: string | null;
      job_description: string;
      company_name: string | null;
      job_title: string | null;
      application_status: string;
      applied_at: string | null;
      created_at: string;
      fit_score: number | null;
    }>(`/api/jobs/${jobId}`, { token }),

  updateJob: (jobId: string, data: Record<string, unknown>, token: string) =>
    request(`/api/jobs/${jobId}`, { method: "PATCH", body: JSON.stringify(data), token }),

  scrapeJob: (url: string, token: string) =>
    request<{ job_description: string; job_title: string | null; company_name: string | null; success: boolean; reason: string | null }>(
      "/api/jobs/scrape",
      { method: "POST", body: JSON.stringify({ url }), token }
    ),

  // Credits
  getPacks: () =>
    request<Array<{ id: string; name: string; credits: number; price_cents: number; price_display: string }>>("/api/credits/packs"),

  getBalance: (token: string) =>
    request<{
      credits: number;
      transactions: Array<{ id: string; amount: number; type: string; description: string; created_at: string }>;
    }>("/api/credits/balance", { token }),

  createCheckout: (packId: string, token: string) =>
    request<{ checkout_url: string }>("/api/credits/checkout", {
      method: "POST",
      body: JSON.stringify({ pack_id: packId }),
      token,
    }),

  // Cover Letter
  generateCoverLetter: (jobId: string, token: string) =>
    request<{ id: string; job_id: string; cv_id: string; content: string; created_at: string }>(
      "/api/cover-letter/generate",
      { method: "POST", body: JSON.stringify({ job_id: jobId }), token }
    ),

  getCoverLetter: (jobId: string, token: string) =>
    request<{ id: string; job_id: string; cv_id: string; content: string; created_at: string }>(
      `/api/cover-letter/${jobId}`,
      { token }
    ),

  updateCoverLetter: (jobId: string, content: string, token: string) =>
    request<{ id: string; job_id: string; cv_id: string; content: string; created_at: string }>(
      `/api/cover-letter/${jobId}`,
      { method: "PUT", body: JSON.stringify({ content }), token }
    ),

  downloadCoverLetter: (jobId: string, token: string, format: "docx" | "pdf" = "docx") =>
    fetch(`${API_URL}/api/cover-letter/${jobId}/download?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    }),

  deleteCoverLetter: (jobId: string, token: string) =>
    request(`/api/cover-letter/${jobId}`, { method: "DELETE", token }),

  // Account
  changePassword: (currentPassword: string, newPassword: string, token: string) =>
    request("/api/account/password", {
      method: "PUT",
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      token,
    }),

  setPassword: (password: string, token: string) =>
    request("/api/account/set-password", {
      method: "PUT",
      body: JSON.stringify({ password }),
      token,
    }),

  deleteAccount: (token: string) =>
    request("/api/account/delete", { method: "DELETE", token }),

  // Profile
  updateProfile: (data: { base_cv_content?: string; additional_info?: string; cv_page_limit?: 1 | 2 }, token: string) =>
    request<{
      id: string;
      email: string;
      email_verified: boolean;
      credits: number;
      has_profile: boolean;
      has_password: boolean;
      base_cv_content: string | null;
      additional_info: string | null;
      cv_page_limit: number;
      created_at: string;
    }>(
      "/api/account/profile",
      { method: "PUT", body: JSON.stringify(data), token }
    ),

  uploadProfile: (file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{
      id: string;
      email: string;
      email_verified: boolean;
      credits: number;
      has_profile: boolean;
      has_password: boolean;
      base_cv_content: string | null;
      additional_info: string | null;
      cv_page_limit: number;
      created_at: string;
    }>(
      "/api/account/profile/upload",
      { method: "POST", body: formData, token }
    );
  },
};

export { ApiError };
