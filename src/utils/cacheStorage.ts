/**
 * Helpers for inspecting and trimming the service worker runtime caches.
 *
 * Chromium pads the quota cost of every cached *opaque* response by a
 * pseudo-random amount (0–14 MiB, ~7 MiB on average) to avoid leaking
 * cross-origin sizes through `navigator.storage.estimate()`. Opaque responses
 * are unreadable from JavaScript, so `response.blob().size` is always 0 and
 * the storage panel used to attribute the padding to "app data".
 */

export type MinimalCacheStorage = {
  keys: () => Promise<string[]>;
  open: (name: string) => Promise<Cache>;
  delete: (name: string) => Promise<boolean>;
};

export type MinimalMarker = Pick<Storage, "getItem" | "setItem">;

export type CacheSummary = {
  name: string;
  entries: number;
  readableBytes: number;
  opaqueEntries: number;
  otherEntries: number;
};

export type PurgeOptions = {
  /** Keep the app-shell precache untouched (default: true). */
  keepPrecache?: boolean;
};

export const OPAQUE_CACHE_PURGE_MARKER = "anthology.cachePurge.opaque.v1";

export const isOpaqueResponse = (response: {
  type: string;
  status: number;
}): boolean => response.type === "opaque" || response.status === 0;

const parseContentLength = (headers: Headers | undefined): number | null => {
  if (!headers) return null;
  const raw = headers.get("content-length");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
};

export const summarizeCache = async (
  name: string,
  cache: Cache
): Promise<CacheSummary> => {
  const requests = await cache.keys();
  let readableBytes = 0;
  let opaqueEntries = 0;
  let otherEntries = 0;

  for (const request of requests) {
    const response = await cache.match(request);
    if (!response) {
      otherEntries += 1;
      continue;
    }

    if (isOpaqueResponse(response)) {
      opaqueEntries += 1;
      continue;
    }

    const declaredSize = parseContentLength(response.headers);
    if (declaredSize !== null) {
      readableBytes += declaredSize;
      continue;
    }

    try {
      readableBytes += (await response.clone().blob()).size;
    } catch {
      otherEntries += 1;
    }
  }

  return {
    name,
    entries: requests.length,
    readableBytes,
    opaqueEntries,
    otherEntries,
  };
};

export const summarizeCacheStorage = async (
  storage: MinimalCacheStorage | undefined
): Promise<CacheSummary[]> => {
  if (!storage) return [];
  const names = await storage.keys();
  return Promise.all(
    names.map(async (name) => summarizeCache(name, await storage.open(name)))
  );
};

export type CacheGroupTotals = {
  precacheBytes: number;
  otherReadableBytes: number;
};

const PRECACHE_CACHE_PREFIX = "workbox-precache";

/**
 * Splits readable cache bytes into the offline app shell (workbox precache)
 * and everything else. The app-shell row explains most of the baseline size.
 */
export const groupCacheSummaries = (
  summaries: CacheSummary[] | null
): CacheGroupTotals | null => {
  if (!summaries) return null;

  return summaries.reduce<CacheGroupTotals>(
    (totals, summary) => {
      if (summary.name.startsWith(PRECACHE_CACHE_PREFIX)) {
        totals.precacheBytes += summary.readableBytes;
      } else {
        totals.otherReadableBytes += summary.readableBytes;
      }
      return totals;
    },
    { precacheBytes: 0, otherReadableBytes: 0 }
  );
};

/**
 * Deletes cached responses that JavaScript cannot read (opaque responses).
 * Those are the ones Chromium pads in the quota estimate. Same-origin assets
 * and the app-shell precache are kept.
 */
export const purgeOpaqueEntries = async (
  storage: MinimalCacheStorage | undefined,
  { keepPrecache = true }: PurgeOptions = {}
): Promise<number> => {
  if (!storage) return 0;

  let removed = 0;
  for (const name of await storage.keys()) {
    if (keepPrecache && name.startsWith("workbox-precache")) continue;

    const cache = await storage.open(name);
    for (const request of await cache.keys()) {
      const response = await cache.match(request);
      if (response && isOpaqueResponse(response)) {
        if (await cache.delete(request)) removed += 1;
      }
    }
  }
  return removed;
};

const defaultCacheStorage = (): MinimalCacheStorage | undefined => {
  try {
    return typeof caches !== "undefined" ? caches : undefined;
  } catch {
    return undefined;
  }
};

const defaultMarker = (): MinimalMarker | undefined => {
  try {
    return typeof localStorage !== "undefined" ? localStorage : undefined;
  } catch {
    return undefined;
  }
};

/**
 * One-time migration for installs that cached third-party images with the
 * old Workbox config. Exposing this as a named function keeps it testable and
 * makes the marker easy to find.
 */
export const purgeLegacyOpaqueCache = async (
  storage: MinimalCacheStorage | undefined = defaultCacheStorage(),
  marker: MinimalMarker | undefined = defaultMarker()
): Promise<number> => {
  if (!storage || !marker) return 0;

  try {
    if (marker.getItem(OPAQUE_CACHE_PURGE_MARKER)) return 0;
  } catch {
    return 0;
  }

  try {
    const removed = await purgeOpaqueEntries(storage);
    marker.setItem(OPAQUE_CACHE_PURGE_MARKER, "1");
    return removed;
  } catch {
    // Leave the marker unset so the purge is retried on the next load.
    return 0;
  }
};
