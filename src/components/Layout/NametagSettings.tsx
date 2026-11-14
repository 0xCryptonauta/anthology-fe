import { useState } from "react";
import { Modal } from "./Modal";
import { NametagForm } from "./NametagForm";
import { useAppSelector } from "@src/store/utils/hooks";
import { useTranslation } from "@src/i18n/useTranslation";

export const NametagSettings = () => {
  const { t } = useTranslation();
  const { nametag } = useAppSelector((state) => state.connect);
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
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
      >
        {nametag ? t("connect.changeNametag") : t("connect.setNametag")}
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
