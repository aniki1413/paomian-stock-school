/**
 * Absolute http(s) URL that leaves this page, or null when the click should
 * stay inside the app. Used so the native shell can open sponsors in the
 * system browser without changing ordinary in-app links.
 */
export function externalUrlToOpen(href: string, pageHref: string): string | null {
  if (!href || href.startsWith("#")) return null;
  let url: URL;
  let page: URL;
  try {
    page = new URL(pageHref);
    url = new URL(href, page);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.origin === page.origin) return null;
  return url.toString();
}
