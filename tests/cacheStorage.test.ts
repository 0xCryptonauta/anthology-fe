import { describe, expect, test } from "bun:test";
import {
  groupCacheSummaries,
  isOpaqueResponse,
  purgeLegacyOpaqueCache,
  purgeOpaqueEntries,
  summarizeCache,
  summarizeCacheStorage,
  type CacheSummary,
  type MinimalCacheStorage,
} from "../src/utils/cacheStorage";

type Entry = { request: Request; response: Response | undefined };

const opaqueResponse = () =>
  ({
    type: "opaque",
    status: 0,
    headers: new Headers(),
    clone() {
      return this;
    },
    blob: async () => new Blob(),
  } as unknown as Response);

const makeCache = (entries: Entry[]) => {
  const cache = {
    keys: async () => entries.map((entry) => entry.request),
    match: async (request: Request) =>
      entries.find((entry) => entry.request.url === request.url)?.response,
    delete: async (request: Request) => {
      const index = entries.findIndex(
        (entry) => entry.request.url === request.url
      );
      if (index === -1) return false;
      entries.splice(index, 1);
      return true;
    },
  };
  return { cache: cache as unknown as Cache, entries };
};

const makeStorage = (caches: Record<string, Entry[]>) => {
  const stores = Object.fromEntries(
    Object.entries(caches).map(([name, entries]) => [
      name,
      makeCache(entries),
    ])
  );
  const storage: MinimalCacheStorage = {
    keys: async () => Object.keys(stores),
    open: async (name: string) => {
      const store = stores[name];
      if (!store) throw new Error(`missing cache ${name}`);
      return store.cache;
    },
    delete: async (name: string) => {
      const existed = Boolean(stores[name]);
      delete stores[name];
      return existed;
    },
  };
  return { storage, stores };
};

const basicEntry = (url: string, contentLength?: string) => ({
  request: new Request(url),
  response: new Response("x", {
    headers: contentLength ? { "content-length": contentLength } : undefined,
  }),
});

const opaqueEntry = (url: string) => ({
  request: new Request(url),
  response: opaqueResponse(),
});

describe("isOpaqueResponse", () => {
  test("treats type opaque as opaque", () => {
    expect(isOpaqueResponse({ type: "opaque", status: 200 })).toBe(true);
  });

  test("treats status 0 as opaque even when type is misreported", () => {
    expect(isOpaqueResponse({ type: "basic", status: 0 })).toBe(true);
  });

  test("treats readable responses as readable", () => {
    expect(isOpaqueResponse({ type: "cors", status: 200 })).toBe(false);
    expect(isOpaqueResponse({ type: "basic", status: 200 })).toBe(false);
  });
});

describe("groupCacheSummaries", () => {
  const summary = (
    name: string,
    readableBytes: number
  ): CacheSummary => ({
    name,
    entries: 1,
    readableBytes,
    opaqueEntries: 0,
    otherEntries: 0,
  });

  test("returns null when cache summaries are unavailable", () => {
    expect(groupCacheSummaries(null)).toBeNull();
  });

  test("splits the app-shell precache from other readable caches", () => {
    const grouped = groupCacheSummaries([
      summary("workbox-precache-v2-http://localhost/", 3000),
      summary("static-assets", 500),
      summary("html-cache", 100),
    ]);

    expect(grouped).toEqual({
      precacheBytes: 3000,
      otherReadableBytes: 600,
    });
  });

  test("returns zeroes for an empty cache list", () => {
    expect(groupCacheSummaries([])).toEqual({
      precacheBytes: 0,
      otherReadableBytes: 0,
    });
  });
});

describe("summarizeCache", () => {
  test("sums declared content-length without reading the body", async () => {
    const { cache } = makeCache([
      basicEntry("https://example.com/a.jpg", "1200"),
      basicEntry("https://example.com/b.jpg", "800"),
    ]);

    const summary = await summarizeCache("static-assets", cache);

    expect(summary).toEqual({
      name: "static-assets",
      entries: 2,
      readableBytes: 2000,
      opaqueEntries: 0,
      otherEntries: 0,
    });
  });

  test("counts opaque entries but adds no readable bytes", async () => {
    const { cache } = makeCache([
      opaqueEntry("https://img.youtube.com/a.jpg"),
      opaqueEntry("https://img.youtube.com/b.jpg"),
      basicEntry("https://example.com/app.png", "300"),
    ]);

    const summary = await summarizeCache("static-assets", cache);

    expect(summary).toEqual({
      name: "static-assets",
      entries: 3,
      readableBytes: 300,
      opaqueEntries: 2,
      otherEntries: 0,
    });
  });

  test("falls back to the blob size when content-length is missing", async () => {
    const { cache } = makeCache([basicEntry("https://example.com/a.jpg")]);

    const summary = await summarizeCache("static-assets", cache);

    expect(summary.readableBytes).toBe(1);
  });

  test("counts entries with no stored response as other", async () => {
    const { cache } = makeCache([
      { request: new Request("https://example.com/missing"), response: undefined },
    ]);

    const summary = await summarizeCache("static-assets", cache);

    expect(summary.otherEntries).toBe(1);
    expect(summary.readableBytes).toBe(0);
  });
});

describe("summarizeCacheStorage", () => {
  test("returns one bucket per cache", async () => {
    const { storage } = makeStorage({
      precache: [basicEntry("https://example.com/index.html", "500")],
      "static-assets": [opaqueEntry("https://img.youtube.com/a.jpg")],
    });

    const buckets = await summarizeCacheStorage(storage);

    expect(buckets).toHaveLength(2);
    expect(buckets.map((bucket) => bucket.name).sort()).toEqual([
      "precache",
      "static-assets",
    ]);
  });

  test("returns an empty list when Cache Storage is unavailable", async () => {
    expect(await summarizeCacheStorage(undefined)).toEqual([]);
  });
});

describe("purgeOpaqueEntries", () => {
  test("removes only opaque entries and keeps readable ones", async () => {
    const { storage, stores } = makeStorage({
      "static-assets": [
        opaqueEntry("https://img.youtube.com/a.jpg"),
        basicEntry("https://example.com/app.png", "300"),
      ],
    });

    const removed = await purgeOpaqueEntries(storage);

    expect(removed).toBe(1);
    expect(stores["static-assets"].entries).toHaveLength(1);
    expect(stores["static-assets"].entries[0].request.url).toBe(
      "https://example.com/app.png"
    );
  });

  test("skips the workbox precache by default", async () => {
    const { storage, stores } = makeStorage({
      "workbox-precache-v2-http://localhost/": [
        opaqueEntry("https://example.com/legacy"),
      ],
    });

    expect(await purgeOpaqueEntries(storage)).toBe(0);
    expect(stores["workbox-precache-v2-http://localhost/"].entries).toHaveLength(
      1
    );
  });
});

describe("purgeLegacyOpaqueCache", () => {
  const createMarker = () => {
    const values = new Map<string, string>();
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };
  };

  test("purges once and records a marker", async () => {
    const { storage, stores } = makeStorage({
      "static-assets": [opaqueEntry("https://img.youtube.com/a.jpg")],
    });
    const marker = createMarker();

    expect(await purgeLegacyOpaqueCache(storage, marker)).toBe(1);
    expect(stores["static-assets"].entries).toHaveLength(0);

    expect(await purgeLegacyOpaqueCache(storage, marker)).toBe(0);
  });

  test("does nothing when the marker already exists", async () => {
    const { storage, stores } = makeStorage({
      "static-assets": [opaqueEntry("https://img.youtube.com/a.jpg")],
    });
    const marker = createMarker();
    marker.setItem("anthology.cachePurge.opaque.v1", "1");

    expect(await purgeLegacyOpaqueCache(storage, marker)).toBe(0);
    expect(stores["static-assets"].entries).toHaveLength(1);
  });

  test("returns 0 when Cache Storage is unavailable", async () => {
    expect(await purgeLegacyOpaqueCache(undefined, createMarker())).toBe(0);
  });
});
