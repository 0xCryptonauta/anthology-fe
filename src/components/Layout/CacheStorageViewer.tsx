import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { store } from "@store/redux";
import { useTranslation } from "@src/i18n/useTranslation";

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

export const CacheStorageViewer = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheBytes, setCacheBytes] = useState<number | null>(null);
  const [usageBytes, setUsageBytes] = useState<number | null>(null);
  const [storeBytes, setStoreBytes] = useState<number | null>(null);

  useEffect(() => {
    if (!show) return;

    const load = async () => {
      setIsLoading(true);

      // The memoir data (Redux store) — reported as "Memory (Anthologies)"
      setStoreBytes(JSON.stringify(store.getState()).length);

      // Total size of the service worker caches (thumbnails, assets, pages)
      if (typeof caches !== "undefined") {
        try {
          const names = await caches.keys();
          let total = 0;
          for (const name of names) {
            const cache = await caches.open(name);
            const requests = await cache.keys();
            for (const request of requests) {
              const response = await cache.match(request);
              if (response) {
                const blob = await response.clone().blob();
                total += blob.size;
              }
            }
          }
          setCacheBytes(total);
        } catch {
          setCacheBytes(null);
        }
      } else {
        setCacheBytes(null);
      }

      // Browser-reported usage: caches + database + service worker
      if (navigator.storage?.estimate) {
        try {
          const { usage } = await navigator.storage.estimate();
          setUsageBytes(usage ?? 0);
        } catch {
          setUsageBytes(null);
        }
      } else {
        setUsageBytes(null);
      }

      setIsLoading(false);
    };

    load();
  }, [show]);

  const appDataBytes =
    usageBytes !== null && cacheBytes !== null
      ? Math.max(0, usageBytes - cacheBytes)
      : null;

  const totalBytes =
    usageBytes !== null && cacheBytes !== null && storeBytes !== null
      ? cacheBytes + Math.max(0, usageBytes - cacheBytes) + storeBytes
      : null;

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    fontSize: "14px",
  };

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
          {t("storage.viewUsage")}
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
          {t("storage.title")}
        </h3>

        {isLoading ? (
          <p style={{ textAlign: "center" }}>{t("common.loading")}</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={rowStyle}>
              <span style={{ fontWeight: "bold" }}>
                {t("storage.totalUsed")}
              </span>
              <span style={{ fontWeight: "bold" }}>
                {totalBytes !== null
                  ? `~${formatBytes(totalBytes)}`
                  : t("storage.nA")}
              </span>
            </div>

            <div style={rowStyle}>
              <span>{t("storage.memory")}</span>
              <span>
                {storeBytes !== null
                  ? `~${formatBytes(storeBytes)}`
                  : t("storage.nA")}
              </span>
            </div>

            <div style={rowStyle}>
              <span>{t("storage.cachedFiles")}</span>
              <span>
                {cacheBytes !== null
                  ? formatBytes(cacheBytes)
                  : t("storage.nA")}
              </span>
            </div>

            <div style={rowStyle}>
              <span>{t("storage.appData")}</span>
              <span>
                {appDataBytes !== null
                  ? `~${formatBytes(appDataBytes)}`
                  : t("storage.nA")}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
