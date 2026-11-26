import { useEffect, useState } from "react";
import {
  getExternalLinkTarget,
  type ExternalLinkTarget,
} from "@src/utils/externalLink";
import { useTranslation } from "@src/i18n/useTranslation";
import { Modal } from "./Modal";

/**
 * Confirms before an anchor takes the user outside the app.
 *
 * One capture-phase listener covers every external link (cards, embeds,
 * explorer, policies) without touching each component. Same-origin routes,
 * hash links, downloads and modified clicks are ignored.
 */
export const ExternalLinkGuard = () => {
  const { t } = useTranslation();
  const [pending, setPending] = useState<ExternalLinkTarget | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const clicked = event.target;
      if (!(clicked instanceof Element)) return;

      const anchor = clicked.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download")) return;

      const external = getExternalLinkTarget(
        anchor.getAttribute("href"),
        anchor.getAttribute("target"),
        window.location.href
      );
      if (!external) return;

      event.preventDefault();
      setPending(external);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const handleStay = () => setPending(null);

  const handleLeave = () => {
    if (!pending) return;

    // mailto/tel hand-offs always happen in the current context.
    const isWeb = /^https?:/i.test(pending.href);
    if (pending.newTab && isWeb) {
      window.open(pending.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.assign(pending.href);
    }
    setPending(null);
  };

  return (
    <Modal
      show={pending !== null}
      onHide={handleStay}
      dialogLabel={t("leave.title")}
      maxWidth="320px"
      contentPadding="18px"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
          {t("leave.title")}
        </h2>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>
          {t("leave.body", { destination: pending?.destination ?? "" })}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "4px",
          }}
        >
          <button
            type="button"
            onClick={handleStay}
            style={{
              flex: 1,
              minHeight: "40px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f1f5f9",
              color: "#111827",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("leave.stay")}
          </button>
          <button
            type="button"
            onClick={handleLeave}
            style={{
              flex: 1,
              minHeight: "40px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #111827",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("leave.leave")}
          </button>
        </div>
      </div>
    </Modal>
  );
};
