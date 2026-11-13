import { Card } from "@components/Layout/Card";
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

interface LocalAnthologyStateProps {
  contractAddr: Address;
}

export const LocalAnthologyState: React.FC<LocalAnthologyStateProps> = ({
  contractAddr,
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

  const downloadLocalAnthology = () => {
    downloadObjAsJson(sharePayload, shareFilename);
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
              onClick={downloadLocalAnthology}
            >
              💾
            </button>
            <QrStreamShareModal
              payload={sharePayload}
              filename={shareFilename}
              title={t("connect.shareTitle", { title: currentTitle || "" })}
              trigger={
                <button
                  type="button"
                  className="icon-button"
                  title={t("connect.shareQr")}
                  aria-label={t("connect.shareQr")}
                >
                  <img
                    src="/icons/qrIcon.svg"
                    alt=""
                    style={{ width: "20px", height: "20px", display: "block" }}
                  />
                </button>
              }
            />
          </div>
        }
      />

      <Card
        title={t("localState.delete")}
        content={
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            trigger={
              <button
                type="button"
                className="icon-button"
                title={t("localState.delete")}
                aria-label={t("localState.delete")}
                onClick={() => setShowDeleteModal(true)}
              >
                <img
                  src="/icons/delete-icon.svg"
                  alt=""
                  style={{ width: "20px", height: "20px", display: "block" }}
                />
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
        }
      />
    </div>
  );
};
