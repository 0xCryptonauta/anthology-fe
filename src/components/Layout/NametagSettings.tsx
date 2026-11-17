import { useState } from "react";
import { Modal } from "./Modal";
import { NametagForm } from "./NametagForm";
import { useAppSelector } from "@src/store/utils/hooks";
import { useTranslation } from "@src/i18n/useTranslation";

export const NametagSettings = ({
  compact = false,
}: {
  compact?: boolean;
}) => {
  const { t } = useTranslation();
  const { nametag } = useAppSelector((state) => state.connect);
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        aria-label={
          compact
            ? nametag
              ? t("connect.changeNametag")
              : t("connect.setNametag")
            : undefined
        }
        style={
          compact
            ? {
                padding: "7px 12px",
                borderRadius: "8px",
                border: "1px solid #30363d",
                backgroundColor: "#21262d",
                color: "#e6edf3",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }
            : {
                cursor: "pointer",
                border: "1px solid #ccc",
                padding: "10px 16px",
                borderRadius: "8px",
                display: "inline-block",
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f7fafc",
                color: "#2b6cb0",
              }
        }
      >
        {compact
          ? nametag
            ? t("common.change")
            : t("connect.setNametag")
          : nametag
          ? t("connect.changeNametag")
          : t("connect.setNametag")}
      </button>

      <Modal show={show} onHide={() => setShow(false)}>
        {show && (
          <NametagForm
            onSaved={() => setShow(false)}
            onCancel={() => setShow(false)}
          />
        )}
      </Modal>
    </>
  );
};
