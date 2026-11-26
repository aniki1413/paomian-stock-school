/** Same host guard as og:image (`publicAppHost` / `resolvePublicHost`). */

function isVercelSystemHost(host: string) {
  return (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  );
}

export function publicAppHost(hostHeader: string | undefined | null) {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (isVercelSystemHost(host)) return "";
  return host;
}

function envHostname() {
  const fromVite = import.meta.env?.VITE_PUBLIC_HOSTNAME;
  if (typeof fromVite === "string" && fromVite.trim()) return fromVite;
  if (typeof process !== "undefined" && process.env?.VITE_PUBLIC_HOSTNAME) {
    return process.env.VITE_PUBLIC_HOSTNAME;
  }
  return "";
}

/**
 * Published apps use `VITE_PUBLIC_HOSTNAME` (the same value the og:image
 * injector prefers). Do not fall back to `window.location` — root `head()`
 * runs on the server and the client, and a client-only host would emit a
 * different tag. The request-host fallback stays in the HTML injector, which
 * is the only place that can see the request without pulling server-only
 * modules into the browser bundle.
 */
export function resolvePublicHost(hostHeader?: string | null) {
  return publicAppHost(envHostname()) || publicAppHost(hostHeader);
}

export function xGameBannerMeta(hostHeader?: string | null) {
  const host = resolvePublicHost(hostHeader);
  if (!host) return null;
  const xBanner = `https://${host}/x-banner.jpg`;
  return { property: "x:game:image" as const, content: xBanner };
}
