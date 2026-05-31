import { QueryClient } from "@tanstack/react-query";
import { LIVE_QUERY_INTERVAL, LIVE_QUERY_STALE_TIME } from "@/lib/liveQuery";
import { TIMEOUTS } from "@shared/constants";

let csrfTokenCache = null;

async function parseJsonOrNull(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function fetchWithTimeout(url, init = {}, timeoutMs = TIMEOUTS.API_REQUEST) {
  const { signal: externalSignal, ...fetchInit } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  try {
    return await fetch(url, {
      ...fetchInit,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function readJsonResponse(response, fallbackMessage = "Request failed") {
  const payload = await parseJsonOrNull(response);
  if (!response.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }
  return payload;
}

async function getCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;

  const res = await fetchWithTimeout("/api/auth/csrf-token", { credentials: "include" });
  if (!res.ok) return null;
  const payload = await parseJsonOrNull(res);
  csrfTokenCache = payload?.csrfToken || null;
  return csrfTokenCache;
}

export function updateCsrfToken(token) {
  csrfTokenCache = token || null;
}

export async function apiRequest(method, url, data) {
  const headers = data ? { "Content-Type": "application/json" } : {};
  if (!["GET", "HEAD", "OPTIONS"].includes(String(method).toUpperCase())) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      headers["x-csrf-token"] = csrfToken;
    }
  }

  const res = await fetchWithTimeout(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    csrfTokenCache = null;
  }

  await throwIfResNotOk(res);
  return res;
}

export async function fetchJson(url, fallbackMessage = "Failed to load data", init = {}) {
  const { timeoutMs = TIMEOUTS.API_REQUEST, ...fetchInit } = init;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        ...fetchInit,
        credentials: fetchInit.credentials || "include",
      },
      timeoutMs,
    );
    return readJsonResponse(response, fallbackMessage);
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`${fallbackMessage}: request timed out`);
    }
    throw error;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const [url] = queryKey;
        const res = await fetchWithTimeout(url, { credentials: "include", signal });

        if (res.status === 401) {
          return null;
        }

        await throwIfResNotOk(res);
        const payload = await res.json();
        if (url === "/api/auth/me" && payload?.csrfToken) {
          updateCsrfToken(payload.csrfToken);
        }
        return payload;
      },
      staleTime: LIVE_QUERY_STALE_TIME,
      gcTime: 10 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchIntervalInBackground: false,
      refetchInterval: (query) => (query.meta?.live === true ? LIVE_QUERY_INTERVAL : false),
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      retry: false,
    },
  },
});
