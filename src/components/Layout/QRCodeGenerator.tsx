import { QRCodeSVG } from "qrcode.react";
import { Modal } from "./Modal";

export const QRCodeGenerator = ({ text }: { text: string }) => {
  return (
    <div>
      <Modal
        placement="bottom"
        trigger={<img src="icons/qrIcon.svg" width="52px" alt="qrIcon" />}
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
    </div>
  );
};
