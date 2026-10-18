import { useState } from "react";
import { Modal } from "./Modal";
import { useToast } from "./Toast";
import { useTranslation } from "@src/i18n/useTranslation";

export const ClearCacheButton = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { addToast } = useToast();

  const clearCaches = async () => {
    setIsClearing(true);
    try {
      if (typeof caches !== "undefined") {
        const names = await caches.keys();
        // Keep the workbox precache (app shell) so the app stays installable
        // offline; remove runtime caches (images, thumbnails, cached pages).
        const runtimeCaches = names.filter(
          (name) => !name.startsWith("workbox-precache")
        );
        await Promise.all(runtimeCaches.map((name) => caches.delete(name)));
      }

      addToast({
        title: t("cache.clearedTitle"),
        content: t("cache.clearedDesc"),
        variant: "info",
      });
      setShow(false);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={() => setShow(false)}
      trigger={
        <button
          type="button"
          style={{
            cursor: "pointer",
            border: "1px solid #ccc",
            padding: "10px 16px",
            borderRadius: "8px",
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "bold",
            backgroundColor: "#f7fafc",
            color: "#dd6b20",
          }}
          onClick={() => setShow(true)}
        >
          {t("cache.clearTrigger")}
        </button>
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
          padding: "10px 0",
        }}
      >
        <div
          style={{
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{t("cache.clearTitle")}</span>
          <span style={{ fontSize: "13px", textAlign: "center" }}>
            {t("cache.clearDesc")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            style={{
              backgroundColor: "#e2e8f0",
              color: "#1a1a1a",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setShow(false)}
          >
            {t("common.cancel")}
          </button>

          <button
            style={{
              backgroundColor: "#dd6b20",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              opacity: isClearing ? 0.6 : 1,
            }}
            disabled={isClearing}
            onClick={clearCaches}
          >
            {isClearing ? t("cache.clearing") : t("cache.clearFiles")}
          </button>
        </div>
      </div>
    </Modal>
  );
};
