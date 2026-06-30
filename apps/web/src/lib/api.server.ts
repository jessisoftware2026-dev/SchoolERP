import "server-only";
import { headers } from "next/headers";
import { getTenantSlugFromHost } from "./tenant";

// Inside Docker the web container cannot reach the API via localhost:4000 —
// that resolves to itself. API_INTERNAL_URL uses the Docker service name instead.
// Falls back to NEXT_PUBLIC_API_URL for local dev (outside Docker).
const SERVER_API_URL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

// Server-side GET that forwards the tenant slug derived from the incoming
// request Host header (subdomain). Use this in Server Components so SSR data is
// correctly tenant-scoped.
export async function apiServerGet<T>(path: string): Promise<T> {
  const host = headers().get("x-forwarded-host") ?? headers().get("host");
  const tenant = getTenantSlugFromHost(host);

  const res = await fetch(`${SERVER_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(tenant ? { "x-tenant-slug": tenant } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      /* ignore */
    }
    throw { status: res.status, message };
  }
  return res.json() as Promise<T>;
}
