import type { CSSProperties } from "react";
import { Card } from "@components/Layout/Card";
import { SettingsRow } from "@components/Layout/SettingsRow";
import { QrIcon } from "@components/Layout/QrIcon";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { useState } from "react";
//import { useParams } from "react-router-dom";
import "./style.css";
import { Address, SkinType } from "@src/types/common";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";
import { Modal } from "@src/components/Layout/Modal";
import { useToast } from "@src/components/Layout/Toast";
import { deleteUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import {
  DEFAULT_SKIN,
  LOCAL_USER_ADDR,
  LOCAL_USER_PATH,
} from "@src/utils/constants";
import { useTranslation } from "@src/i18n/useTranslation";
import { useReceivedFrom } from "@src/hooks/useIsReadOnlyAnthology";
import { QrStreamShareModal } from "../Connect/QrStreamShareModal";
import type { LoadedJson } from "@src/utils/validateJsonContentType";
import { parseContractTitle } from "@src/utils/parseContractsCategories";

interface LocalAnthologyStateProps {
  contractAddr: Address;
  /** Renders the SettingsRow layout used by the anthology panel. */
  embedded?: boolean;
}

const valueStyle: CSSProperties = {
  fontSize: "14px",
  color: "#cbd5e1",
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "8px",
  flexWrap: "wrap",
};

const iconActionStyle: CSSProperties = {
  width: "44px",
  height: "44px",
  padding: "7px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#21262d",
  border: "1px solid #30363d",
  borderRadius: "8px",
  color: "#e6edf3",
  cursor: "pointer",
  flexShrink: 0,
};

const iconDangerStyle: CSSProperties = {
  ...iconActionStyle,
  backgroundColor: "#7f1d1d",
  border: "1px solid #991b1b",
  color: "#fecaca",
};

export const LocalAnthologyState: React.FC<LocalAnthologyStateProps> = ({
  contractAddr,
  embedded = false,
}) => {
  const { t } = useTranslation();
  const receivedFrom = useReceivedFrom(contractAddr);
  const currentTitle = useAppSelector(
    (state) => state.localAnthology.contractsTitles[contractAddr]
  );
  const anthology = useAppSelector(
    (state) => state.localAnthology.anthologies[contractAddr]
  );
  const defaultSkin = useAppSelector(
    (state) => state.localAnthology.defaultSkin[contractAddr]
  );

  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const displayTitle =
    parseContractTitle(currentTitle || "").title || t("common.untitled");

  const sharePayload: LoadedJson = {
    anthology: {
      contractAddr: contractAddr,
      title: currentTitle || "",
      anthology: anthology || [],
      defaultSkin: (defaultSkin || DEFAULT_SKIN) as SkinType,
    },
  };
  const shareFilename = `${(currentTitle || "anthology").replace(
    /\s+/g,
    "_"
  )}_share.json`;
  const anthologyFilename = `${(currentTitle || "anthology").replace(
    /\s+/g,
    "_"
  )}_anthology.json`;

  const downloadLocalAnthology = () => {
    downloadObjAsJson(sharePayload, anthologyFilename);
  };

  const handleDownloadClick = () => {
    // Both own and received anthologies confirm before writing a file.
    setShowDownloadModal(true);
  };

  const handleDeleteAnthology = () => {
    dispatch(
      deleteUserLocalAnthology({
        user: LOCAL_USER_ADDR,
        contract: contractAddr,
      })
    );

    dispatch(updateCurrentPath(LOCAL_USER_PATH));
    window.history.pushState(
      { currentPath: LOCAL_USER_PATH },
      "",
      window.location.pathname
    );

    addToast({
      title: t("localState.deletedTitle"),
      content: t("localState.deletedDesc"),
      variant: "success",
      delay: 5000,
    });

    setShowDeleteModal(false);
  };

  const downloadAction = (
    <button
      type="button"
      title={t("localState.download")}
      aria-label={t("localState.download")}
      style={iconActionStyle}
      onClick={handleDownloadClick}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );

  const shareAction = !receivedFrom ? (
    <QrStreamShareModal
      payload={sharePayload}
      filename={shareFilename}
      title={t("connect.shareTitle", { title: displayTitle })}
      trigger={
        <button
          type="button"
          title={t("connect.shareQr")}
          aria-label={t("connect.shareQr")}
          style={{
            width: "44px",
            height: "44px",
            padding: "4px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#21262d",
            border: "1px solid #30363d",
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <QrIcon size={32} radius={4} />
        </button>
      }
    />
  ) : null;

  const deleteModal = (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      trigger={
        <button
          type="button"
          title={t("localState.delete")}
          aria-label={t("localState.delete")}
          style={iconDangerStyle}
          onClick={() => setShowDeleteModal(true)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      }
    >
      <div
        style={{
          margin: "30px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontWeight: "bold", textAlign: "center" }}>
          {receivedFrom
            ? t("connect.deleteCopyTitle")
            : t("localState.deleteTitle")}
        </span>
        <span style={{ textAlign: "center" }}>
          {receivedFrom
            ? t("connect.deleteCopyDesc")
            : t("localState.deleteDesc")}
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
          type="button"
          style={{
            backgroundColor: "#e2e8f0",
            color: "#1a1a1a",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          {t("common.cancel")}
        </button>
        <button
          type="button"
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleDeleteAnthology}
        >
          {t("localState.delete")}
        </button>
      </div>
    </Modal>
  );

  const downloadModal = (
    <Modal
      show={showDownloadModal}
      onHide={() => setShowDownloadModal(false)}
    >
      <div
        style={{
          margin: "20px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          color: "#1a1a1a",
          textAlign: "center",
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          {receivedFrom
            ? t("connect.downloadConnectedTitleOne")
            : t("localState.downloadConfirmTitle")}
        </span>
        <span>
          {receivedFrom
            ? t("connect.downloadConnectedDescOne")
            : t("localState.downloadConfirmDesc", { title: displayTitle })}
        </span>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="button"
            style={{
              backgroundColor: "#e2e8f0",
              color: "#1a1a1a",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setShowDownloadModal(false)}
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#2b6cb0",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              downloadLocalAnthology();
              setShowDownloadModal(false);
            }}
          >
            {receivedFrom
              ? t("connect.downloadConnectedConfirm")
              : t("localState.downloadConfirm")}
          </button>
        </div>
      </div>
    </Modal>
  );

  if (embedded) {
    return (
      <>
        <div style={{ width: "100%" }}>
          <SettingsRow
            first
            label={t("anthologyState.title")}
            control={
              <span style={valueStyle} translate="no">
                {displayTitle}
              </span>
            }
          />

          <SettingsRow
            label={t("anthologyState.memoirCount")}
            control={<span style={valueStyle}>{anthology?.length ?? 0}</span>}
          />

          <SettingsRow
            label={t("localState.maxMemoirs")}
            control={<span style={valueStyle}>100</span>}
          />

          <SettingsRow
            label={t("anthologyState.defaultSkin")}
            control={<span style={valueStyle}>{defaultSkin || DEFAULT_SKIN}</span>}
          />

          {receivedFrom && (
            <>
              <SettingsRow
                label={t("connect.connectedFrom")}
                control={
                  <span style={valueStyle} translate="no">
                    {receivedFrom.nametag}
                  </span>
                }
              />
              <SettingsRow
                label={t("connect.receivedOn")}
                control={
                  <span style={valueStyle}>
                    {new Date(receivedFrom.receivedAt).toLocaleDateString()}
                  </span>
                }
              />
            </>
          )}

          <SettingsRow
            label={t("localState.download")}
            control={downloadAction}
          />

          {shareAction && (
            <SettingsRow
              label={t("connect.shareQr")}
              control={shareAction}
            />
          )}

          <SettingsRow
            label={t("localState.delete")}
            control={deleteModal}
          />
        </div>

        {downloadModal}
      </>
    );
  }

  return (
    <div
      style={{
        //border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        maxWidth: "380px",
        boxSizing: "border-box",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Card title={t("anthologyState.title")} content={currentTitle} />

      <Card title={t("anthologyState.memoirCount")} content={anthology?.length ?? 0} />

      <Card title={t("localState.maxMemoirs")} content="100" />

      <Card title={t("anthologyState.defaultSkin")} content={defaultSkin} />

      {receivedFrom && (
        <>
          <Card
            title={t("connect.connectedFrom")}
            content={<span translate="no">{receivedFrom.nametag}</span>}
          />
          <Card
            title={t("connect.receivedOn")}
            content={new Date(receivedFrom.receivedAt).toLocaleDateString()}
          />
        </>
      )}

      <Card
        title={t("localState.download")}
        content={
          <div style={actionRowStyle}>
            <button
              type="button"
              title={t("localState.download")}
              aria-label={t("localState.download")}
              style={{
                cursor: "pointer",
                fontSize: "20px",
                background: "none",
                border: "none",
                padding: 0,
              }}
              onClick={handleDownloadClick}
            >
              💾
            </button>
            {shareAction}
          </div>
        }
      />

      <Card title={t("localState.delete")} content={deleteModal} />

      {downloadModal}
    </div>
  );
};
