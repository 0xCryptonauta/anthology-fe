import { useEffect, useState } from "react";
import { Modal } from "./Modal";

interface CacheEntryInfo {
  name: string;
  entries: string[];
}

const RPC_CACHE_PREFIXES = ["readFactory:", "readAnthology:"];

export const CacheStorageViewer = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStorageAvailable, setCacheStorageAvailable] = useState(true);
  const [cacheInfo, setCacheInfo] = useState<CacheEntryInfo[]>([]);
  const [rpcKeys, setRpcKeys] = useState<string[]>([]);

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
              return { name, entries: requests.map((req) => req.url) };
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
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && RPC_CACHE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
          keys.push(key);
        }
      }
      setRpcKeys(keys);

      setIsLoading(false);
    };

    load();
  }, [show]);

  const totalEntries = cacheInfo.reduce(
    (sum, cache) => sum + cache.entries.length,
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <span style={{ fontWeight: "bold" }}>
                Files (images, assets, pages): {totalEntries}
              </span>

              {!cacheStorageAvailable ? (
                <p style={{ fontSize: "13px", color: "#666" }}>
                  Cache Storage is not available in this browser.
                </p>
              ) : cacheInfo.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#666" }}>
                  No cached files.
                </p>
              ) : (
                cacheInfo.map((cache) => (
                  <details key={cache.name} style={{ marginTop: "6px" }}>
                    <summary
                      style={{ cursor: "pointer", fontSize: "14px" }}
                    >
                      {cache.name} ({cache.entries.length})
                    </summary>
                    <ul
                      style={{
                        margin: "6px 0 0",
                        paddingLeft: "18px",
                        maxHeight: "150px",
                        overflowY: "auto",
                        fontSize: "12px",
                        color: "#555",
                        wordBreak: "break-all",
                      }}
                    >
                      {cache.entries.map((url) => (
                        <li key={url}>{url}</li>
                      ))}
                    </ul>
                  </details>
                ))
              )}
            </div>

            <div>
              <span style={{ fontWeight: "bold" }}>
                Contract reads (localStorage): {rpcKeys.length}
              </span>

              {rpcKeys.length === 0 ? (
                <p style={{ fontSize: "13px", color: "#666" }}>
                  No cached contract reads.
                </p>
              ) : (
                <ul
                  style={{
                    margin: "6px 0 0",
                    paddingLeft: "18px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    fontSize: "12px",
                    color: "#555",
                    wordBreak: "break-all",
                  }}
                >
                  {rpcKeys.map((key) => (
                    <li key={key}>{key}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
