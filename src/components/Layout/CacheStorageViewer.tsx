import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { store } from "@store/redux";

interface CacheInfo {
  name: string;
  entryCount: number;
  bytes: number;
}

const RPC_CACHE_PREFIXES = ["readFactory:", "readAnthology:"];

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

export const CacheStorageViewer = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStorageAvailable, setCacheStorageAvailable] = useState(true);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([]);
  const [otherStorageBytes, setOtherStorageBytes] = useState<number | null>(
    null
  );
  const [rpcCache, setRpcCache] = useState<{ count: number; bytes: number }>({
    count: 0,
    bytes: 0,
  });

  useEffect(() => {
    if (!show) return;

    const load = async () => {
      setIsLoading(true);

      // Cache Storage (service worker caches: thumbnails, app assets, html)
      if (typeof caches !== "undefined") {
        try {
          const names = await caches.keys();
          const infos = await Promise.all(
            names.map(async (name) => {
              const cache = await caches.open(name);
              const requests = await cache.keys();
              let bytes = 0;
              for (const request of requests) {
                const response = await cache.match(request);
                if (response) {
                  const blob = await response.clone().blob();
                  bytes += blob.size;
                }
              }
              return { name, entryCount: requests.length, bytes };
            })
          );
          setCacheInfo(infos);
          setCacheStorageAvailable(true);
        } catch {
          setCacheStorageAvailable(false);
        }
      } else {
        setCacheStorageAvailable(false);
      }

      // localStorage RPC caches (factory / anthology contract reads)
      let count = 0;
      let bytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && RPC_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
          count++;
          // UTF-16 storage: ~2 bytes per char
          bytes += (key.length + (localStorage.getItem(key)?.length ?? 0)) * 2;
        }
      }
      setRpcCache({ count, bytes });

      // Total origin storage minus the memoir data (the Redux store), which
      // /about reports as "memory being used"
      if (navigator.storage?.estimate) {
        try {
          const { usage } = await navigator.storage.estimate();
          const storeBytes = JSON.stringify(store.getState()).length;
          setOtherStorageBytes(Math.max(0, (usage ?? 0) - storeBytes));
        } catch {
          setOtherStorageBytes(null);
        }
      } else {
        setOtherStorageBytes(null);
      }

      setIsLoading(false);
    };

    load();
  }, [show]);

  const totalCacheBytes = cacheInfo.reduce(
    (sum, cache) => sum + cache.bytes,
    0
  );
  const totalCacheEntries = cacheInfo.reduce(
    (sum, cache) => sum + cache.entryCount,
    0
  );

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={() => setShow(false)}
      trigger={
        <span
          style={{
            cursor: "pointer",
            border: "1px solid #ccc",
            padding: "10px 16px",
            borderRadius: "8px",
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "bold",
            backgroundColor: "#f7fafc",
            color: "#2f855a",
          }}
          onClick={() => setShow(true)}
        >
          View cached files
        </span>
      }
    >
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,
          color: "#1a1a1a",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Cached Storage
        </h3>

        {isLoading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span style={{ fontWeight: "bold", display: "block" }}>
                Storage used (excl. memoirs):{" "}
                {otherStorageBytes !== null
                  ? `~${formatBytes(otherStorageBytes)}`
                  : "n/a"}
              </span>
              <span style={{ fontSize: "12px", color: "#666" }}>
                Total browser storage for the app minus your memoir data (the
                memoir size lives in /about).
              </span>
            </div>

            <div>
              <span style={{ fontWeight: "bold", display: "block" }}>
                Cached files (images, assets, pages):{" "}
                {formatBytes(totalCacheBytes)}
                {totalCacheEntries > 0 ? ` (${totalCacheEntries})` : ""}
              </span>

              {!cacheStorageAvailable ? (
                <p style={{ fontSize: "13px", color: "#666" }}>
                  Cache Storage is not available in this browser.
                </p>
              ) : cacheInfo.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#666" }}>
                  No cached files yet — browse memoirs with videos or images
                  so the app caches thumbnails and assets.
                </p>
              ) : (
                cacheInfo.map((cache) => (
                  <div
                    key={cache.name}
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      marginTop: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cache.name}
                    </span>
                    <span style={{ whiteSpace: "nowrap" }}>
                      {formatBytes(cache.bytes)} ({cache.entryCount})
                    </span>
                  </div>
                ))
              )}
            </div>

            <div>
              <span style={{ fontWeight: "bold", display: "block" }}>
                Contract reads (localStorage): {formatBytes(rpcCache.bytes)}
              </span>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {rpcCache.count} {rpcCache.count === 1 ? "entry" : "entries"}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
