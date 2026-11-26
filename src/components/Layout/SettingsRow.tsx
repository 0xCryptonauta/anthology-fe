import type { ReactNode } from "react";

export const SettingsRow = ({
  label,
  description,
  control,
  first = false,
  danger = false,
}: {
  label: string;
  description?: ReactNode;
  control: ReactNode;
  first?: boolean;
  danger?: boolean;
}) => (
  <div
    className="settings-row"
    style={{
      borderTop: first ? "none" : "1px solid #21262d",
    }}
  >
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: "15px",
          fontWeight: 500,
          color: danger ? "#fca5a5" : "white",
        }}
      >
        {label}
      </div>
      {description && (
        <div style={{ marginTop: "2px", fontSize: "12px", color: "#94a3b8" }}>
          {description}
        </div>
      )}
    </div>
    <div>{control}</div>
  </div>
);
