import { useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "./Toast";
import { useState } from "react";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";
import { useAccount } from "wagmi";

export const DownloadReduxStore = () => {
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );
  const localAnthology = useAppSelector((state) => state.localAnthology);
  const { addToast } = useToast();
  const { isConnected } = useAccount();

  const [addDiscovery, setAddDiscovery] = useState(false);
  const [addLocal, setAddLocal] = useState(false);
  const [addNewFileName, setAddNewFileName] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const downloadUserSelection = () => {
    let dataToDownload = {};
    if (addNewFileName && newFileName.trim() === "") {
      addToast({
        title: "File name required",
        content: "Please enter a file name for the download.",
        variant: "info",
      });
      return;
    }
    if (!addDiscovery && !addLocal) {
      addToast({
        title: "No options selected",
        content: "Please select at least one option to download.",
        variant: "info",
      });
      return;
    }

    if (addDiscovery) {
      dataToDownload = {
        ...dataToDownload,
        users,
        userContracts,
        contractsTitles,
      };
    }
    if (addLocal) {
      dataToDownload = {
        ...dataToDownload,
        localAnthology,
      };
    }

    let fileName = "";
    fileName += addDiscovery ? "discovery" : "";
    fileName += addLocal && addDiscovery ? "_&_" : "";
    fileName += addLocal ? "local_anthology" : "";

    downloadObjAsJson(dataToDownload, addNewFileName ? newFileName : fileName);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "320px",
        margin: "10px auto",
        padding: "25px 30px",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
        fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`,
        color: "#1a1a1a",
      }}
    >
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

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={addLocal}
            onChange={() => setAddLocal(!addLocal)}
            style={checkboxInputStyle}
          />
          <span>Local Anthologies</span>
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
          💾 Download
        </button>
      </div>
    </div>
  );
};

// Reusable styles
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
