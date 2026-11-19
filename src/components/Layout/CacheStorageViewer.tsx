import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { settingsActionButtonStyle } from "./settingsStyles";
import { store } from "@store/redux";
import { useTranslation } from "@src/i18n/useTranslation";
import {
  groupCacheSummaries,
  summarizeCacheStorage,
  type CacheSummary,
} from "@src/utils/cacheStorage";

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const sumBy = (
  summaries: CacheSummary[] | null,
  key: "readableBytes" | "opaqueEntries" | "otherEntries"
): number | null =>
  summaries
    ? summaries.reduce((total, summary) => total + summary[key], 0)
    : null;

export const CacheStorageViewer = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usageBytes, setUsageBytes] = useState<number | null>(null);
  const [storeBytes, setStoreBytes] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<CacheSummary[] | null>(null);

  useEffect(() => {
    if (!show) return;

    const load = async () => {
      setIsLoading(true);

      // The memoir data (Redux store) — reported as "Memory (Anthologies)".
      // Blob.size counts UTF-8 bytes, unlike String.length.
      setStoreBytes(new Blob([JSON.stringify(store.getState())]).size);

      // Readable bytes and opaque entry counts. Opaque responses (cross-origin
      // no-cors fetches) are unreadable from JavaScript and are padded by the
      // browser in the quota estimate below.
      if (typeof caches !== "undefined") {
        try {
          setSummaries(await summarizeCacheStorage(caches));
        } catch {
          setSummaries(null);
        }
      } else {
        setSummaries(null);
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

  const readableBytes = sumBy(summaries, "readableBytes");
  const opaqueEntries = sumBy(summaries, "opaqueEntries");
  const groups = groupCacheSummaries(summaries);

  // localStorage is not part of the browser storage estimate on every browser,
  // so keep both numbers visible instead of pretending they are one metric.
  const totalBytes =
    usageBytes !== null && storeBytes !== null
      ? usageBytes + storeBytes
      : null;

  const appDataBytes =
    usageBytes !== null && readableBytes !== null
      ? Math.max(0, usageBytes - readableBytes)
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
        <button
          type="button"
          style={settingsActionButtonStyle}
          onClick={() => setShow(true)}
        >
          {t("settings.actionView")}
        </button>
      }
    >
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          borderRadius: "16px",
          backgroundColor: "transparent",
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
              <span>{t("storage.appShell")}</span>
              <span>
                {groups !== null
                  ? formatBytes(groups.precacheBytes)
                  : t("storage.nA")}
              </span>
            </div>

            <div style={rowStyle}>
              <span>{t("storage.otherCachedFiles")}</span>
              <span>
                {groups !== null
                  ? formatBytes(groups.otherReadableBytes)
                  : t("storage.nA")}
              </span>
            </div>

            {opaqueEntries !== null && opaqueEntries > 0 && (
              <div style={rowStyle}>
                <span>{t("storage.opaqueResponses")}</span>
                <span>{opaqueEntries}</span>
              </div>
            )}

            <div style={rowStyle}>
              <span>
                {opaqueEntries !== null && opaqueEntries > 0
                  ? t("storage.appDataWithOpaque")
                  : t("storage.appData")}
              </span>
              <span>
                {appDataBytes !== null
                  ? `~${formatBytes(appDataBytes)}`
                  : t("storage.nA")}
              </span>
            </div>

            {opaqueEntries !== null && opaqueEntries > 0 && (
              <p role="note" style={{ fontSize: "12px", margin: 0 }}>
                {t("storage.opaqueHint")}
              </p>
            )}

            <p role="note" style={{ fontSize: "12px", margin: 0 }}>
              {t("storage.browserCacheNote")}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
