// Tenant (school) resolution from the hostname/subdomain.
//
//   demo.localhost:3000   -> "demo"
//   demo.jessierp.com     -> "demo"
//   localhost / jessierp.com / www|app|api -> null (platform/root)

const RESERVED = new Set(["www", "app", "api", "admin", "localhost", ""]);
const PLATFORM_HOSTS = /\.(vercel\.app|netlify\.app|railway\.app|onrender\.com)$/;

export function getTenantSlugFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const name = host.split(":")[0]; // strip port
  if (PLATFORM_HOSTS.test(name)) return null; // vercel.app / netlify.app etc. are root
  const labels = name.split(".");
  if (labels.length < 2) return null; // bare "localhost" or single label
  const sub = labels[0].toLowerCase();
  return RESERVED.has(sub) ? null : sub;
}

// Client-side: derive the tenant from the browser location.
export function getTenantSlug(): string | null {
  if (typeof window === "undefined") return null;
  return getTenantSlugFromHost(window.location.host);
}
