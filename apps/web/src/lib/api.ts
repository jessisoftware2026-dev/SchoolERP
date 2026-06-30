// Thin REST client for the NestJS core ERP backend (tenant-aware).
import { getTenantSlug } from "./tenant";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// localStorage key shared with the auth module.
export const TOKEN_KEY = "jessi_token";

export type ApiError = { status: number; message: string };

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage.getItem(TOKEN_KEY) ?? undefined;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const tenant = getTenantSlug(); // from the current subdomain (client)

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenant ? { "x-tenant-slug": tenant } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      /* ignore */
    }
    throw { status: res.status, message } as ApiError;
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { API_URL };
