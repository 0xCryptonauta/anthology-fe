const EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export interface ExternalLinkTarget {
  href: string;
  /** Hostname for pages, or the address for mailto/tel links. */
  destination: string;
  newTab: boolean;
}

/**
 * Classifies an anchor `href` as leaving the app.
 *
 * Returns `null` for same-origin routes, in-page hash links and protocols we
 * never allow to leave through the confirmation sheet. Everything else gets a
 * canonical URL plus a display destination for the confirmation copy.
 */
export const getExternalLinkTarget = (
  rawHref: string | null | undefined,
  target: string | null | undefined,
  baseUrl: string
): ExternalLinkTarget | null => {
  if (!rawHref) return null;

  const href = rawHref.trim();
  if (!href || href.startsWith("#")) return null;

  let url: URL;
  let base: URL;
  try {
    base = new URL(baseUrl);
    url = new URL(href, base);
  } catch {
    return null;
  }

  if (!EXTERNAL_PROTOCOLS.has(url.protocol)) return null;

  const isWeb = url.protocol === "http:" || url.protocol === "https:";
  if (isWeb && url.origin === base.origin) return null;

  return {
    href: url.href,
    destination: url.host || url.pathname.replace(/^\/+/, ""),
    newTab: target === "_blank",
  };
};
