import type { ReactElement } from "react";
import { Modal } from "../Layout/Modal";
import { QrStreamSharePanel } from "./QrStreamSharePanel";
import type { LoadedJson } from "@src/utils/validateJsonContentType";

interface QrStreamShareModalProps {
  payload: LoadedJson;
  filename: string;
  title: string;
  trigger: ReactElement;
}

export const QrStreamShareModal = ({
  payload,
  filename,
  title,
  trigger,
}: QrStreamShareModalProps) => {
  return (
    <Modal
      trigger={trigger}
      height="90dvh"
      maxWidth="min(362px, calc(100vw - 10px))"
      bodyPadding="0"
      contentPadding="5px"
      scrollable
    >
      <QrStreamSharePanel
        payload={payload}
        filename={filename}
        title={title}
      />
    </Modal>
  );
};
