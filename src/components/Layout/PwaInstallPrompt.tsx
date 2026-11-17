import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { dismissPwaInstallPrompt } from "@src/store/slices/dappSlice";
import { usePwaInstallState } from "@src/hooks/usePwaInstallState";
import {
  PWA_INSTALL_PROMPT_DELAY_MS,
  promptInstall,
  shouldShowInstallPrompt,
} from "@src/utils/pwaInstallPrompt";
import { useTranslation } from "@src/i18n/useTranslation";
import { Modal } from "./Modal";

/**
 * Automatic install nudge: appears on the home route only, waits 15 seconds so
 * it never interrupts a share/QR handoff, and respects a persisted weekly
 * cooldown after a dismissal.
 */
export const PwaInstallPrompt = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { canInstall, installed } = usePwaInstallState();
  const dismissedAt = useAppSelector(
    (state) => state.dapp.pwaInstallPromptDismissedAt ?? null
  );
  const [open, setOpen] = useState(false);

  const onHome = pathname === "/";

  useEffect(() => {
    if (open) return;

    const eligible = () =>
      shouldShowInstallPrompt({
        onHome,
        installed,
        canInstall,
        dismissedAt,
        now: Date.now(),
      });

    if (!eligible()) return;

    const timer = window.setTimeout(() => {
      // Re-check at fire time: the user may have installed or navigated away.
      if (eligible()) setOpen(true);
    }, PWA_INSTALL_PROMPT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [open, onHome, installed, canInstall, dismissedAt]);

  const handleDismiss = () => {
    dispatch(dismissPwaInstallPrompt());
    setOpen(false);
  };

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome !== "unavailable") dispatch(dismissPwaInstallPrompt());
    setOpen(false);
  };

  return (
    <Modal
      show={open}
      onHide={handleDismiss}
      dialogLabel={t("install.promptTitle")}
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
          {t("install.promptTitle")}
        </h2>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>
          {t("install.promptBody")}
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
            onClick={handleInstall}
            style={{
              flex: 1,
              minHeight: "40px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #166534",
              backgroundColor: "#166534",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("install.button")}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
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
            {t("install.notNow")}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
          {t("install.promptHint")}
        </p>
      </div>
    </Modal>
  );
};
