import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { extractFirstUrl } from "./embeds";

const toURL = (raw: string): URL | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    );
  } catch {
    return null;
  }
};

/**
 * Normalizes a URL for duplicate comparison: drops protocol, `www.`, query
 * params, hashes and trailing slashes, lowercases host and path.
 */
export const normalizeUrlForComparison = (raw: string): string | null => {
  const url = toURL(raw);
  if (!url) return null;

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname.replace(/\/+$/, "").toLowerCase();

  return `${host}${path}`;
};

/** True when the memoir contains the same URL as `normalizedUrl`. */
export const memoirHasUrl = (
  memoir: MemoirInterface,
  normalizedUrl: string
): boolean => {
  const existingUrl = extractFirstUrl(memoir.content);
  if (!existingUrl) return false;

  return normalizeUrlForComparison(existingUrl) === normalizedUrl;
};
