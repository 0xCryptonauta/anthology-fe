import { QRCodeSVG } from "qrcode.react";
import { Modal } from "./Modal";
import { useState } from "react";

export const QRCodeGenerator = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={
        <img
          src="icons/qrIcon.svg"
          width="52px"
          alt="qrIcon"
          onClick={() => setShow(true)}
        ></img>
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
