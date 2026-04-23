import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useFeatureFlag } from "./use-feature-flag";

function wrapper(client: QueryClient) {
  const QueryWrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  QueryWrapper.displayName = "QueryWrapper";
  return QueryWrapper;
}

describe("useFeatureFlag", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns enabled=false while loading", () => {
    fetchMock.mockImplementation(() => new Promise(() => {})); // never resolves
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useFeatureFlag("foo"), { wrapper: wrapper(client) });
    expect(result.current.enabled).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it("returns enabled=true when the API says so", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ name: "foo", enabled: true }),
    });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useFeatureFlag("foo"), { wrapper: wrapper(client) });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.enabled).toBe(true);
  });

  it("falls back to enabled=false on API error", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => useFeatureFlag("foo"), { wrapper: wrapper(client) });
    // Hook has retry: 1 in production; wait long enough for the retry to settle.
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });
    expect(result.current.enabled).toBe(false);
    expect(result.current.error).toBeDefined();
  });
});
