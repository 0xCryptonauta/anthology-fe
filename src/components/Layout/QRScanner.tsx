import React, { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { useTranslation } from "@src/i18n/useTranslation";

type QRScannerProps = {
  onScan: (text: string) => void;
  onError?: (err: string) => void;
  qrboxSize?: number;
};

const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onError,
  qrboxSize = 250,
}) => {
  const { t } = useTranslation();
  const scannerRef = useRef<unknown>(null);
  const elementId = "qr-reader";
  const [active, setActive] = useState(false);

  const handleClose = () => setActive(false);

  const offcanvasRef = useRef<HTMLDivElement>(null);

  const mouseDownRef = useRef(false);

  let isMounted = true;

  const startScanner = async () => {
    const lib = await import("html5-qrcode");
    const Html5Qrcode = lib.Html5Qrcode;

    const html5QrCode = new Html5Qrcode(elementId);
    scannerRef.current = html5QrCode;

    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices.length) throw new Error("No camera devices found");

      if (!isMounted) return;

      await html5QrCode.start(
        { facingMode: "environment" }, // ← this triggers rear camera
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: 1,
        },

        (decodedText) => {
          onScan(decodedText);
          // Auto stop after first successful scan
          html5QrCode.stop().then(() => {
            html5QrCode.clear();
            scannerRef.current = null;
            setActive(false); // auto-close
          });
        },
        (err) => {
          if (onError) onError(err);
        }
      );
    } catch (err: unknown) {
      if (onError) onError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current =
        !!offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      const isSelectingText =
        selection &&
        selection.type === "Range" &&
        selection.toString().length > 0;

      if (
        mouseDownRef.current &&
        !isSelectingText &&
        offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
      mouseDownRef.current = false;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // The modal only mounts `#qr-reader` after `active` becomes true, so start
  // the camera from an effect once the element is in the DOM.
  useEffect(() => {
    if (!active) return;

    startScanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (!active) return;

    return () => {
      isMounted = false;

      const scanner = scannerRef.current as {
        stop: () => Promise<void>;
        clear: () => Promise<void>;
        getState: () => number;
      };

      // RUNNING = 2, PAUSED = 3
      if (
        scanner &&
        typeof scanner.getState === "function" &&
        [2, 3].includes(scanner.getState())
      ) {
        scanner
          .stop()
          .then(() => {
            scanner.clear();
            scannerRef.current = null;
          })
          .catch(console.error);
      }
    };
  }, [active, onScan, onError, qrboxSize]);

  return (
    <Modal
      placement="bottom"
      show={active}
      onHide={handleClose}
      trigger={
        <button
          type="button"
          className="icon-button"
          aria-label={t("a11y.scanQr")}
          onClick={() => setActive(true)}
        >
          <img src="icons/qrIcon.svg" width="32px" alt="" />
        </button>
      }
    >
      <span style={{ marginBottom: "10px" }} role="status">
        {t("a11y.scanQr")}
      </span>
      <div
        id={elementId}
        aria-label={t("a11y.scanQr")}
        style={{
          width: "200px",
          maxWidth: "100%",
          height: "auto",
          aspectRatio: "1 / 1",
          margin: "0 auto",
          border: "2px solid #ccc",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
      />
    </Modal>
  );
};

export default QRScanner;
