import React, { useEffect, useRef, useState } from "react";

// src/global.d.ts
interface BarcodeDetectorOptions {
  formats: string[];
}

interface DetectedBarcode {
  rawValue: string;
  format: string;
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  static getSupportedFormats(): Promise<string[]>;
  detect(
    image: HTMLVideoElement | HTMLImageElement | ImageBitmap
  ): Promise<DetectedBarcode[]>;
}

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      console.error("BarcodeDetector is not supported on this browser.");
      return;
    }

    const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();

          video.addEventListener("play", () => {
            const scan = () => {
              barcodeDetector
                .detect(video)
                .then((codes) => {
                  if (codes.length > 0) {
                    setQrCode(codes[0].rawValue);
                  } else {
                    requestAnimationFrame(scan);
                  }
                })
                .catch((err) => console.error(err));
            };
            scan();
          });
        }
      })
      .catch((err) => console.error("Error accessing camera: ", err));

    return () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }}></video>
      {qrCode && <p>QR Code detected: {qrCode}</p>}
    </div>
  );
};

export default QRScanner;
