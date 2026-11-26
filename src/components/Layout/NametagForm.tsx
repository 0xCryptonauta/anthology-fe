import { useEffect, useId, useState } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { ensureDeviceId, setNametag } from "@src/store/slices/connectSlice";
import { validateNametag, MAX_NAMETAG_LENGTH } from "@src/utils/shareEnvelope";
import { useToast } from "./Toast";
import { useTranslation } from "@src/i18n/useTranslation";

interface NametagFormProps {
  onSaved: () => void;
  onCancel?: () => void;
}

export const NametagForm = ({ onSaved, onCancel }: NametagFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { deviceId, nametag } = useAppSelector((state) => state.connect);

  const [draft, setDraft] = useState(nametag);
  const inputId = useId();
  const errorId = useId();

  useEffect(() => {
    if (!deviceId) dispatch(ensureDeviceId());
  }, [deviceId, dispatch]);

  useEffect(() => {
    setDraft(nametag);
  }, [nametag]);

  const error = validateNametag(draft);
  const errorMessage =
    error === "empty"
      ? t("connect.nametagEmpty")
      : error === "too-long"
      ? t("connect.nametagTooLong")
      : null;

  const handleSave = () => {
    if (error) return;

    dispatch(setNametag(draft));
    setDraft(draft.trim());
    addToast({
      title: t("connect.nametagTitle"),
      content: t("connect.nametagSaved"),
      variant: "success",
      delay: 3000,
    });
    onSaved();
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        color: "#1a1a1a",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: 0, textAlign: "center" }}>
        {t("connect.nametagTitle")}
      </h3>

      <label htmlFor={inputId} style={{ fontWeight: 500 }}>
        {t("connect.nametagLabel")}
      </label>
      <input
        id={inputId}
        type="text"
        value={draft}
        maxLength={MAX_NAMETAG_LENGTH}
        translate="no"
        aria-invalid={!!error}
        aria-describedby={errorMessage ? errorId : undefined}
        onChange={(event) => setDraft(event.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: error ? "1px solid #dc2626" : "1px solid #ccc",
          fontSize: "14px",
          color: "#1a1a1a",
          backgroundColor: "#fff",
          outline: "none",
        }}
      />

      {errorMessage && (
        <span
          id={errorId}
          role="alert"
          style={{ color: "#dc2626", fontSize: "12px" }}
        >
          {errorMessage}
        </span>
      )}

      <p style={{ margin: 0, color: "#4a5568", fontSize: "12px" }}>
        {t("connect.nametagHelp")}
      </p>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#1a1a1a",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {t("common.cancel")}
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!!error}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: error ? "#a0aec0" : "#2b6cb0",
            color: "#fff",
            fontWeight: 500,
            cursor: error ? "not-allowed" : "pointer",
          }}
        >
          {t("common.save")}
        </button>
      </div>
    </div>
  );
};
