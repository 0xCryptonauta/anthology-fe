import { QRCodeSVG } from "qrcode.react";
import { Modal } from "./Modal";
import { useState } from "react";
import { useTranslation } from "@src/i18n/useTranslation";

export const QRCodeGenerator = ({ text }: { text: string }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={
        <button
          type="button"
          className="icon-button"
          aria-label={t("a11y.qrCode")}
          onClick={() => setShow(true)}
        >
          <img src="icons/qrIcon.svg" width="52px" alt="" />
        </button>
      }
    >
      <QRCodeSVG
        value={text}
        size={256}
        level="H"
        bgColor="#ffffff"
        fgColor="#000000"
        includeMargin={true}
      />
    </Modal>
  );
};
