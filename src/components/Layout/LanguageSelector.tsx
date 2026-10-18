import { useState } from "react";
import { useTranslation } from "@src/i18n/useTranslation";
import { LocalePreference } from "@src/store/slices/dappSlice";
import { Modal } from "./Modal";

const options: { value: LocalePreference; labelKey: "language.auto" | "language.english" | "language.spanish" }[] = [
  { value: "auto", labelKey: "language.auto" },
  { value: "en", labelKey: "language.english" },
  { value: "es", labelKey: "language.spanish" },
];

export const LanguageSelector = () => {
  const { t, localePref, setLocale } = useTranslation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

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
          {t("language.title")}
        </span>
      }
    >
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
          {t("language.title")}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {options.map((option) => (
            <label key={option.value} style={radioLabelStyle}>
              <input
                type="radio"
                name="locale"
                checked={localePref === option.value}
                onChange={() => setLocale(option.value)}
                style={radioInputStyle}
              />
              <span>{t(option.labelKey)}</span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
};

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
