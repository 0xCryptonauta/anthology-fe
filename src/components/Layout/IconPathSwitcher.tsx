import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "./Toast";
import { toggleIsIconToLocal } from "@src/store/slices/dappSlice";
import { useAccount } from "wagmi";

export const IconPathSwitcher = () => {
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { isConnected } = useAccount();

  const handleToggle = (toLocal: boolean) => {
    if (toLocal !== isIconToLocal) {
      dispatch(toggleIsIconToLocal());
      addToast({
        title: "Icon path changed",
        content: toLocal
          ? "Now pointing to local anthologies"
          : "Now pointing to on-chain anthologies",
        variant: "success",
        delay: 3000,
      });
    }
  };

  return (
    isConnected && (
      <div
        style={{
          maxWidth: "420px",
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
          Icon Path Switcher
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="iconPath"
              checked={isIconToLocal}
              onChange={() => handleToggle(true)}
              style={radioInputStyle}
            />
            <span>Local User Anthologies</span>
          </label>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="iconPath"
              checked={!isIconToLocal}
              onChange={() => handleToggle(false)}
              style={radioInputStyle}
            />
            <span>Web3 Anthologies</span>
          </label>
        </div>
      </div>
    )
  );
};

// Reusable styles
const radioLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
  cursor: "pointer",
};

const radioInputStyle: React.CSSProperties = {
  width: "18px",
  height: "18px",
  accentColor: "#3b82f6",
  cursor: "pointer",
};
