import { useQuery } from "@tanstack/react-query";

/**
 * Evaluate a feature flag for the current user.
 *
 * Per ADR 0003, flags live in Postgres and are evaluated server-side. This
 * hook caches the result for 60s to avoid hitting the API on every render;
 * flipping a flag in the DB takes up to that long to propagate to clients,
 * which is fine for our use case.
 *
 * Returns `{ enabled: false, isLoading: true }` on first render.
 */
export function useFeatureFlag(name: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  const query = useQuery({
    queryKey: ["feature-flag", name],
    queryFn: async (): Promise<{ name: string; enabled: boolean }> => {
      const token =
        typeof document !== "undefined"
          ? document.cookie
              .split("; ")
              .find((row) => row.startsWith("access_token="))
              ?.split("=")[1]
          : undefined;

      const res = await fetch(`${apiUrl}/api/feature-flags/${encodeURIComponent(name)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        throw new Error(`feature flag lookup failed: ${res.status}`);
      }
      return res.json();
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  return {
    enabled: query.data?.enabled ?? false,
    isLoading: query.isLoading,
    error: query.error,
  };
}
