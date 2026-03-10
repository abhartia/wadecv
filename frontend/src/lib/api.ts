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

class StreamingNotAvailableError extends ApiError {
  constructor(message: string, status = 0) {
    super(message, status);
    this.name = "StreamingNotAvailableError";
  }
}

export interface CVGenerateResponse {
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
}

export type CVGenerationStage =
  | "start"
  | "setup"
  | "scraping_job"
  | "job_metadata"
  | "deduct_credit"
  | "first_pass_generation"
  | "layout_feedback"
  | "second_pass_generation"
  | "saving"
  | "done"
  | "error";

export type CVGenerationEventType = "progress" | "done" | "error";

export interface CVGenerationProgressEvent {
  type: CVGenerationEventType;
  stage: CVGenerationStage;
  message: string;
  progress?: number | null;
  cv_id?: string | null;
  job_id?: string | null;
  result?: CVGenerateResponse | null;
}

/** Refresh tokens using refresh_token from localStorage; save and notify. Returns new access token or null. */
async function tryRefreshTokens(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
      credentials: "include",
    });
    if (!res.ok) return null;
    const tokens = (await res.json()) as { access_token: string; refresh_token: string };
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    window.dispatchEvent(new CustomEvent("tokensRefreshed", { detail: tokens }));
    return tokens.access_token;
  } catch {
    return null;
  }
}

/** Performs fetch; on 401 with a token, tries refresh and one retry with new token. */
async function fetchWithAuth(url: string, init: RequestInit, token: string | null): Promise<Response> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(url, { ...init, headers, credentials: "include" });
  if (res.status !== 401 || !token) return res;
  const newToken = await tryRefreshTokens();
  if (!newToken) return res;
  headers.set("Authorization", `Bearer ${newToken}`);
  return fetch(url, { ...init, headers, credentials: "include" });
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetchWithAuth(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  }, token ?? null);

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

  fitCV: (
    data: { cv_id?: string; job_id?: string; job_url?: string; job_description?: string; additional_info?: string; page_limit?: 1 | 2 },
    token: string,
  ) =>
    request<CVGenerateResponse>("/api/cv/fit", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  generateCV: (data: { cv_id?: string; job_id?: string; job_url?: string; job_description?: string; additional_info?: string; page_limit?: 1 | 2 }, token: string) =>
    request<CVGenerateResponse>("/api/cv/generate", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  generateCVStream: async (
    data: { cv_id?: string; job_id?: string; job_url?: string; job_description?: string; additional_info?: string; page_limit?: 1 | 2 },
    token: string,
    onEvent?: (event: CVGenerationProgressEvent) => void,
  ): Promise<CVGenerateResponse> => {
    let res: Response;
    let sawEvent = false;

    try {
      res = await fetchWithAuth(
        `${API_URL}/api/cv/generate/stream`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        },
        token ?? null,
      );
    } catch (err) {
      const message = (err as Error)?.message || "Streaming not available";
      throw new StreamingNotAvailableError(message, 0);
    }

    if (!res.ok || !res.body) {
      let message = "An error occurred";
      try {
        const body = (await res.json()) as { detail?: string };
        message = body.detail || message;
      } catch {
        // ignore body parse failures
      }
      throw new StreamingNotAvailableError(message, res.status);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalResult: CVGenerateResponse | null = null;

    try {
      // Read newline-delimited JSON events from the stream
      // Each line should be a JSON-encoded CVGenerationProgressEvent
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let event: CVGenerationProgressEvent;
          try {
            event = JSON.parse(trimmed) as CVGenerationProgressEvent;
          } catch {
            continue;
          }

          sawEvent = true;
          onEvent?.(event);

          if (event.type === "done" && event.result) {
            finalResult = event.result;
          } else if (event.type === "error") {
            const message = event.message || "Generation failed";
            throw new ApiError(message, 500);
          }
        }
      }
    } catch (err) {
      if (!sawEvent || err instanceof StreamingNotAvailableError) {
        const message =
          err instanceof Error ? err.message : "Streaming not available";
        const status = err instanceof ApiError ? err.status : 0;
        throw new StreamingNotAvailableError(message, status);
      }
      throw err;
    }

    if (!finalResult) {
      throw new ApiError("Generation failed before completion", 500);
    }

    return finalResult;
  },

  refineFitAnalysis: (cvId: string, data: { gap_feedback: Record<string, string> }, token: string) =>
    request<CVGenerateResponse>(`/api/cv/${cvId}/fit/refine`, {
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

  refineCVStream: async (
    cvId: string,
    data: { gap_feedback: Record<string, string> },
    token: string,
    onEvent?: (event: CVGenerationProgressEvent) => void,
  ): Promise<CVGenerateResponse> => {
    let res: Response;
    let sawEvent = false;

    try {
      res = await fetchWithAuth(
        `${API_URL}/api/cv/${cvId}/refine/stream`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        },
        token ?? null,
      );
    } catch (err) {
      const message = (err as Error)?.message || "Streaming not available";
      throw new StreamingNotAvailableError(message, 0);
    }

    if (!res.ok || !res.body) {
      let message = "An error occurred";
      try {
        const body = (await res.json()) as { detail?: string };
        message = body.detail || message;
      } catch {
        // ignore body parse failures
      }
      throw new StreamingNotAvailableError(message, res.status);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalResult: CVGenerateResponse | null = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let event: CVGenerationProgressEvent;
          try {
            event = JSON.parse(trimmed) as CVGenerationProgressEvent;
          } catch {
            continue;
          }

          sawEvent = true;
          onEvent?.(event);

          if (event.type === "done" && event.result) {
            finalResult = event.result;
          } else if (event.type === "error") {
            const message = event.message || "Refinement failed";
            throw new ApiError(message, 500);
          }
        }
      }
    } catch (err) {
      if (!sawEvent || err instanceof StreamingNotAvailableError) {
        const message = err instanceof Error ? err.message : "Streaming not available";
        const status = err instanceof ApiError ? err.status : 0;
        throw new StreamingNotAvailableError(message, status);
      }
      throw err;
    }

    if (!finalResult) {
      throw new ApiError("Refinement failed before completion", 500);
    }

    return finalResult;
  },

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
    fetchWithAuth(
      `${API_URL}/api/cv/${cvId}/download?format=${format}`,
      {},
      token
    ),

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
    fetchWithAuth(
      `${API_URL}/api/cover-letter/${jobId}/download?format=${format}`,
      {},
      token
    ),

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

export { ApiError, StreamingNotAvailableError };
