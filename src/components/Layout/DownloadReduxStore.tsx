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

const filterLocalByAddresses = (
  local: localAnthologyState,
  selected: Set<string>
): Partial<localAnthologyState> => {
  const localContracts = local.userContracts?.[LOCAL_USER_ADDR] || [];
  const filteredContracts = localContracts.filter((addr: Address) => selected.has(addr));

  const result: Partial<localAnthologyState> = {
    users: filteredContracts.length > 0 ? [LOCAL_USER_ADDR] : [],
    userContracts: { [LOCAL_USER_ADDR]: filteredContracts },
    contractsTitles: {},
    anthologies: {},
    defaultSkin: {},
  };

  for (const addr of filteredContracts) {
    result.contractsTitles![addr] = local.contractsTitles[addr] || "";
    result.anthologies![addr] = local.anthologies[addr] || [];
    result.defaultSkin![addr] = local.defaultSkin[addr] || DEFAULT_SKIN;
  }

  return result;
};

export const DownloadReduxStore = () => {
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
  const handleClose = () => setShow(false);

  const [selectionScreen, setSelectionScreen] = useState(false);

  const localUserTitles: MemoirContent[] = useMemo(() => {
    const contracts = localAnthology.userContracts?.[LOCAL_USER_ADDR] || [];
    return contracts.map((addr, i) => ({
      address: addr,
      title: localAnthology.contractsTitles[addr] || "",
      originalIndex: i,
    }));
  }, [localAnthology]);

  const downloadUserSelection = () => {
    if (addNewFileName && newFileName.trim() === "") {
      addToast({
        title: "File name required",
        content: "Please enter a file name for the download.",
        variant: "info",
      });
      return;
    }
    if (!addDiscovery && !addLocal && !addCustomSelection) {
      addToast({
        title: "No options selected",
        content: "Please select at least one option to download.",
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
        localMemory: localAnthology,
      };
    }

    let fileName = "";
    fileName += addDiscovery ? "discovery" : "";
    fileName += addLocal && addDiscovery ? "_&_" : "";
    fileName += addLocal ? "local_anthology" : "";

    downloadObjAsJson(dataToDownload, addNewFileName ? newFileName : fileName);
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

    downloadObjAsJson(dataToDownload, addNewFileName ? newFileName : fileName);
    setSelectionScreen(false);
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
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
            color: "#2b6cb0",
          }}
          onClick={() => setShow(true)}
        >
          Download your Data
        </span>
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
        {selectionScreen ? (
          <SelectAnthologiesForDownload
            inline
            onHide={() => setSelectionScreen(false)}
            userTitles={localUserTitles}
            onDownload={handleCustomDownload}
          />
        ) : (
          <>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
              Download Your Data
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
                  <span>My Discoveries</span>
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
                <span>Local Anthologies</span>
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
                <span>Custom Selection</span>
              </label>

              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={addNewFileName}
                  onChange={() => setAddNewFileName(!addNewFileName)}
                  style={checkboxInputStyle}
                />
                <span>Custom File Name</span>
              </label>

              {addNewFileName && (
                <input
                  type="text"
                  placeholder="Enter file name"
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
              >
                {addCustomSelection ? "Select Anthologies →" : "💾 Download"}
              </button>
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
