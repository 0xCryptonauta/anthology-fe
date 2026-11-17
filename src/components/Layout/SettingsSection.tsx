import type { ReactNode } from "react";
import { useAppSelector } from "@src/store/utils/hooks";
import { getBgClass } from "@src/utils/backgrounds";

export const SettingsSection = ({
  title,
  description,
  backgroundKey,
  danger = false,
  children,
}: {
  title: string;
  description?: string;
  backgroundKey?: string;
  danger?: boolean;
  children: ReactNode;
}) => {
  const categoryBackgroundsEnabled = useAppSelector(
    (state) => state.dapp.categoryBackgroundsEnabled
  );
  const patterned = categoryBackgroundsEnabled && !danger;

  return (
    <section
      className={`settings-card ${
        patterned
          ? `${getBgClass(backgroundKey ?? title)} text-shadow-dark`
          : ""
      }`}
      style={{
        width: "100%",
        backgroundColor: danger
          ? "#1f1111"
          : patterned
          ? "transparent"
          : "#161b22",
        border: `1px solid ${danger ? "#7f1d1d" : "#30363d"}`,
        borderRadius: "12px",
        padding: "16px 18px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 600,
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          color: danger ? "#fca5a5" : "white",
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: danger
              ? "#fecaca"
              : patterned
              ? "#e2e8f0"
              : "#94a3b8",
          }}
        >
          {description}
        </p>
      )}

      <div style={{ marginTop: "10px" }}>{children}</div>
    </section>
  );
};
