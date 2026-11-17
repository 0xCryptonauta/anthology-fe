import { useState } from "react";
import { Address } from "@src/types/common";
import { Modal } from "@src/components/Layout/Modal";
import { SettingsSection } from "@src/components/Layout/SettingsSection";
import { useAppSelector } from "@store/utils/hooks";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { useTranslation } from "@src/i18n/useTranslation";
import { LocalAnthologyState } from "./LocalAnthologyState";
import { LocalAnthologyOwner } from "./LocalAnthologyOwner";
import { AnthologyState } from "./AnthologyState";
import { AnthologyOwner } from "./AnthologyOwner";
import { MemoirBuffer } from "./MemoirBuffer";

/* Same visual language as the View/Order selectors, one 36px gear. */
const gearButtonStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f9f9f9",
  border: "1px solid #ccc",
  borderRadius: "8px",
  color: "#1a1a1a",
  cursor: "pointer",
  flexShrink: 0,
};

const closeButtonStyle: React.CSSProperties = {
  minWidth: "32px",
  minHeight: "32px",
  padding: "5px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#21262d",
  border: "1px solid #30363d",
  borderRadius: "8px",
  color: "#e6edf3",
  cursor: "pointer",
};

export const AnthologyPanel = ({ contractAddr }: { contractAddr: Address }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const local = isLocalAnthology(contractAddr);
  const { userAddr } = useAppSelector((state) => state.user);
  const anthologyState = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr]?.anthologyState : undefined
  );
  const isOwner = !local && userAddr === anthologyState?.owner;

  const close = () => setShow(false);

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={close}
      height="88dvh"
      maxWidth="520px"
      contentPadding="0"
      contentMargin="8px"
      scrollable
      surface="dark"
      dialogLabel={t("anthologyPanel.title")}
      /* Nested title/delete/share dialogs must not dismiss the panel. */
      dismissOnOutsideClick={false}
      trigger={
        <button
          type="button"
          aria-label={t("anthologyPanel.open")}
          aria-haspopup="dialog"
          aria-expanded={show}
          title={t("anthologyPanel.open")}
          style={gearButtonStyle}
          onClick={() => setShow(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      }
    >
      <div className="anthology-panel">
        <div className="anthology-panel-header">
          <h2 className="anthology-panel-title">
            {t("anthologyPanel.title")}
          </h2>
          <button
            type="button"
            aria-label={t("anthologyPanel.close")}
            title={t("anthologyPanel.close")}
            style={closeButtonStyle}
            onClick={close}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="anthology-panel-body">
          <SettingsSection
            title={t("anthologyPanel.info")}
            backgroundKey={`${contractAddr}-info`}
          >
            {local ? (
              <LocalAnthologyState contractAddr={contractAddr} embedded />
            ) : (
              <AnthologyState contractAddr={contractAddr} embedded />
            )}
          </SettingsSection>

          <SettingsSection
            title={t("anthologyPanel.settings")}
            backgroundKey={`${contractAddr}-settings`}
          >
            {local ? (
              <LocalAnthologyOwner contractAddr={contractAddr} embedded />
            ) : isOwner ? (
              <AnthologyOwner contractAddr={contractAddr} embedded />
            ) : (
              <p className="anthology-panel-note">
                {t("anthologyPanel.ownerOnly")}
              </p>
            )}
          </SettingsSection>

          {!local && isOwner && anthologyState?.useBuffer && (
            <SettingsSection
              title={t("owner.buffer")}
              backgroundKey={`${contractAddr}-buffer`}
            >
              <MemoirBuffer contractAddr={contractAddr} />
            </SettingsSection>
          )}
        </div>
      </div>
    </Modal>
  );
};
