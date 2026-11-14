import { useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "./Toast";
import { useState, useMemo } from "react";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";
import { useAccount } from "wagmi";
import { Modal } from "./Modal";
import { SelectAnthologiesForDownload } from "@components/Factory/SelectAnthologiesForDownload";
import { Address, MemoirContent } from "@src/types/common";
import { LOCAL_USER_ADDR, DEFAULT_SKIN } from "@src/utils/constants";
import { localAnthologyState } from "@src/store/slices/localAnthologySlice";
import { useTranslation } from "@src/i18n/useTranslation";
import {
  filterShareableAddresses,
  pickLocalMemory,
} from "@src/utils/localMemoryPayload";
import type {
  LoadedJson,
  LocalMemoryPayload,
} from "@src/utils/validateJsonContentType";
import { QrStreamSharePanel } from "@components/Connect/QrStreamSharePanel";

const filterLocalByAddresses = (
  local: localAnthologyState,
  selected: Set<string>
): LocalMemoryPayload => {
  const localContracts = local.userContracts?.[LOCAL_USER_ADDR] || [];
  const filteredContracts = localContracts.filter((addr: Address) => selected.has(addr));

  const result: LocalMemoryPayload = {
    users: filteredContracts.length > 0 ? [LOCAL_USER_ADDR] : [],
    userContracts: { [LOCAL_USER_ADDR]: filteredContracts },
    contractsTitles: {},
    anthologies: {},
    defaultSkin: {},
  };

  for (const addr of filteredContracts) {
    result.contractsTitles[addr] = local.contractsTitles[addr] || "";
    result.anthologies[addr] = local.anthologies[addr] || [];
    result.defaultSkin[addr] = local.defaultSkin[addr] || DEFAULT_SKIN;
  }

  return result;
};

export const DownloadReduxStore = () => {
  const { t } = useTranslation();
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );
  const localAnthology = useAppSelector((state) => state.localAnthology);
  const { addToast } = useToast();
  const { isConnected } = useAccount();

  const [addDiscovery, setAddDiscovery] = useState(false);
  const [addLocal, setAddLocal] = useState(false);
  const [addCustomSelection, setAddCustomSelection] = useState(false);
  const [addNewFileName, setAddNewFileName] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const [show, setShow] = useState(false);
  const [selectionScreen, setSelectionScreen] = useState(false);
  const [sharePayload, setSharePayload] = useState<{
    payload: LoadedJson;
    filename: string;
  } | null>(null);
  const [pendingDownload, setPendingDownload] = useState<{
    data: Record<string, unknown>;
    filename: string;
    connectedCount: number;
  } | null>(null);

  const receivedFrom = localAnthology.receivedFrom ?? {};

  const handleClose = () => {
    setShow(false);
    setSharePayload(null);
    setPendingDownload(null);
    setSelectionScreen(false);
  };

  const localUserTitles: MemoirContent[] = useMemo(() => {
    const contracts = localAnthology.userContracts?.[LOCAL_USER_ADDR] || [];
    return contracts.map((addr, i) => ({
      address: addr,
      title: localAnthology.contractsTitles[addr] || "",
      originalIndex: i,
    }));
  }, [localAnthology]);

  const openShare = (selected?: Set<string>) => {
    if (addNewFileName && newFileName.trim() === "") {
      addToast({
        title: t("settings.fileNameRequired"),
        content: t("settings.fileNameRequiredDesc"),
        variant: "info",
      });
      return;
    }

    const filename =
      (addNewFileName ? newFileName : "local_anthology") + "_share.json";

    if (!selected && !addLocal) return;

    const localAddresses =
      localAnthology.userContracts?.[LOCAL_USER_ADDR] || [];
    const selectedAddresses = (selected
      ? [...selected]
      : localAddresses) as Address[];
    const { shareable, skipped } = filterShareableAddresses(
      selectedAddresses,
      receivedFrom
    );

    if (skipped > 0) {
      addToast({
        title: t("connect.shareSkippedConnected", { count: skipped }),
        content: t("connect.shareSkippedConnectedDesc"),
        variant: "info",
        delay: 5000,
      });
    }

    if (shareable.length === 0) {
      addToast({
        title: t("connect.shareOnlyConnected"),
        content: t("connect.shareOnlyConnectedDesc"),
        variant: "info",
        delay: 5000,
      });
      return;
    }

    setSharePayload({
      payload: {
        localMemory: filterLocalByAddresses(
          localAnthology,
          new Set(shareable)
        ),
      },
      filename,
    });
    setSelectionScreen(false);
  };

  const handleShareClick = () => {
    if (addCustomSelection) {
      setSelectionScreen(true);
      return;
    }
    openShare();
  };

  const downloadUserSelection = () => {
    if (addNewFileName && newFileName.trim() === "") {
      addToast({
        title: t("settings.fileNameRequired"),
        content: t("settings.fileNameRequiredDesc"),
        variant: "info",
      });
      return;
    }
    if (!addDiscovery && !addLocal && !addCustomSelection) {
      addToast({
        title: t("settings.noOptionsSelected"),
        content: t("settings.selectOneDownload"),
        variant: "info",
      });
      return;
    }

    if (addCustomSelection) {
      setSelectionScreen(true);
      return;
    }

    let dataToDownload = {};

    if (addDiscovery) {
      dataToDownload = {
        ...dataToDownload,
        discoveries: {
          users,
          userContracts,
          contractsTitles,
        },
      };
    }
    if (addLocal) {
      dataToDownload = {
        ...dataToDownload,
        localMemory: pickLocalMemory(localAnthology),
      };
    }

    let fileName = "";
    fileName += addDiscovery ? "discovery" : "";
    fileName += addLocal && addDiscovery ? "_&_" : "";
    fileName += addLocal ? "local_anthology" : "";

    const localAddresses = addLocal
      ? localAnthology.userContracts?.[LOCAL_USER_ADDR] || []
      : [];
    const connectedCount = localAddresses.filter(
      (address) => receivedFrom[address]
    ).length;
    const finalName = addNewFileName ? newFileName : fileName;

    if (connectedCount > 0) {
      setPendingDownload({
        data: dataToDownload,
        filename: finalName,
        connectedCount,
      });
      return;
    }

    downloadObjAsJson(dataToDownload, finalName);
  };

  const handleCustomDownload = (selected: Set<string>) => {
    let dataToDownload = {};

    if (addDiscovery) {
      dataToDownload = {
        ...dataToDownload,
        discoveries: {
          users,
          userContracts,
          contractsTitles,
        },
      };
    }

    const filteredLocal = filterLocalByAddresses(localAnthology, selected);
    dataToDownload = {
      ...dataToDownload,
      localMemory: filteredLocal,
    };

    let fileName = "";
    fileName += addDiscovery ? "discovery" : "";
    fileName += addDiscovery && selected.size > 0 ? "_&_" : "";
    fileName += selected.size > 0 ? "local_anthology" : "";

    const connectedCount = [...selected].filter(
      (address) => receivedFrom[address as Address]
    ).length;
    const finalName = addNewFileName ? newFileName : fileName;

    if (connectedCount > 0) {
      setPendingDownload({
        data: dataToDownload,
        filename: finalName,
        connectedCount,
      });
      setSelectionScreen(false);
      return;
    }

    downloadObjAsJson(dataToDownload, finalName);
    setSelectionScreen(false);
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
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
            color: "#2b6cb0",
          }}
          onClick={() => setShow(true)}
        >
          {t("settings.downloadData")}
        </button>
      }
    >
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          //margin: "10px auto",
          //padding: "25px 30px",
          borderRadius: "16px",
          backgroundColor: "#ffffff",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,
          color: "#1a1a1a",
        }}
      >
        {pendingDownload ? (
          <div
            style={{
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              color: "#1a1a1a",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>
              {t("connect.downloadConnectedTitle")}
            </h3>
            <p style={{ margin: 0 }}>
              {t("connect.downloadConnectedDesc", {
                count: pendingDownload.connectedCount,
              })}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setPendingDownload(null)}
                style={{
                  backgroundColor: "#e2e8f0",
                  color: "#1a1a1a",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadObjAsJson(
                    pendingDownload.data,
                    pendingDownload.filename
                  );
                  setPendingDownload(null);
                }}
                style={{
                  backgroundColor: "#2b6cb0",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t("connect.downloadConnectedConfirm")}
              </button>
            </div>
          </div>
        ) : sharePayload ? (
          <div
            style={{
              padding: "20px 16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <QrStreamSharePanel
              payload={sharePayload.payload}
              filename={sharePayload.filename}
              title={t("connect.shareGroupTitle")}
              onBack={() => setSharePayload(null)}
            />
          </div>
        ) : selectionScreen ? (
          <SelectAnthologiesForDownload
            inline
            onHide={() => setSelectionScreen(false)}
            userTitles={localUserTitles}
            onDownload={handleCustomDownload}
            onShare={(selected) => openShare(selected)}
          />
        ) : (
          <>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              {t("settings.downloadDataTitle")}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {isConnected && (
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={addDiscovery}
                    onChange={() => setAddDiscovery(!addDiscovery)}
                    style={checkboxInputStyle}
                  />
                  <span>{t("settings.myDiscoveries")}</span>
                </label>
              )}

              <label
                style={{
                  ...checkboxLabelStyle,
                  opacity: addCustomSelection ? 0.5 : 1,
                  pointerEvents: addCustomSelection ? "none" : "auto",
                }}
              >
                <input
                  type="checkbox"
                  checked={addLocal}
                  onChange={() => {
                    setAddLocal(!addLocal);
                    if (!addLocal) setAddCustomSelection(false);
                  }}
                  style={checkboxInputStyle}
                />
                <span>{t("settings.localAnthologies")}</span>
              </label>

              <label
                style={{
                  ...checkboxLabelStyle,
                  opacity: addLocal ? 0.5 : 1,
                  pointerEvents: addLocal ? "none" : "auto",
                }}
              >
                <input
                  type="checkbox"
                  checked={addCustomSelection}
                  onChange={() => {
                    setAddCustomSelection(!addCustomSelection);
                    if (!addCustomSelection) setAddLocal(false);
                  }}
                  style={checkboxInputStyle}
                />
                <span>{t("settings.customSelection")}</span>
              </label>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={addNewFileName}
                  onChange={() => setAddNewFileName(!addNewFileName)}
                  style={checkboxInputStyle}
                />
                <span>{t("settings.customFileName")}</span>
              </label>

              {addNewFileName && (
                <input
                  type="text"
                  placeholder={t("settings.enterFileName")}
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  style={{
                    padding: "10px 5px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              )}

              <button
                type="button"
                onClick={downloadUserSelection}
                style={{
                  marginTop: "20px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontWeight: "500",
                  fontSize: "15px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563eb")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3b82f6")
                }
                onFocus={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2563eb")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3b82f6")
                }
              >
                {addCustomSelection
                  ? t("settings.selectAnthologies")
                  : t("settings.download")}
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                disabled={!addLocal && !addCustomSelection}
                style={{
                  marginTop: "-8px",
                  backgroundColor: "#f9fafb",
                  color: "#374151",
                  fontWeight: "500",
                  fontSize: "15px",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  cursor:
                    !addLocal && !addCustomSelection
                      ? "not-allowed"
                      : "pointer",
                  opacity: !addLocal && !addCustomSelection ? 0.5 : 1,
                }}
              >
                {t("settings.shareViaQr")}
              </button>

              {addDiscovery && !addLocal && !addCustomSelection && (
                <span
                  style={{
                    color: "#718096",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  {t("settings.sharePrivateOnly")}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
  cursor: "pointer",
};

const checkboxInputStyle: React.CSSProperties = {
  width: "18px",
  height: "18px",
  accentColor: "#3b82f6",
  cursor: "pointer",
};
