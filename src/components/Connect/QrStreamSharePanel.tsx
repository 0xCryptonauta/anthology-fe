import { useEffect, useMemo, useRef, useState } from "react";
import { MAX_INPUT_BYTES, PRESETS } from "@orozcoh/qr-stream";
import { useQrStreamWriter } from "@orozcoh/qr-stream/react";
import {
  estimateTransferSeconds,
  renderQrStream,
} from "@orozcoh/qr-stream/browser";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { ensureDeviceId } from "@src/store/slices/connectSlice";
import {
  buildShareEnvelope,
  validateNametag,
} from "@src/utils/shareEnvelope";
import type { LoadedJson } from "@src/utils/validateJsonContentType";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";
import { useTranslation } from "@src/i18n/useTranslation";
import { NametagForm } from "@src/components/Layout/NametagForm";

interface QrStreamSharePanelProps {
  payload: LoadedJson;
  filename: string;
  title: string;
  onBack?: () => void;
}

const STREAM_FPS = 15;

export const QrStreamSharePanel = ({
  payload,
  filename,
  title,
  onBack,
}: QrStreamSharePanelProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { deviceId, nametag } = useAppSelector((state) => state.connect);

  const [running, setRunning] = useState(false);
  const [view, setView] = useState<"share" | "nametag">("share");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!deviceId) dispatch(ensureDeviceId());
  }, [deviceId, dispatch]);

  useEffect(() => {
    if (view !== "share") setRunning(false);
  }, [view]);

  const hasNametag = validateNametag(nametag) === null;

  const sharedBy = useMemo(
    () =>
      deviceId && hasNametag
        ? { deviceId, nametag: nametag.trim() }
        : null,
    [deviceId, hasNametag, nametag]
  );

  const bytes = useMemo(
    () =>
      sharedBy
        ? new TextEncoder().encode(
            JSON.stringify(buildShareEnvelope(payload, sharedBy))
          )
        : null,
    [payload, sharedBy]
  );

  const tooLarge = bytes !== null && bytes.length > MAX_INPUT_BYTES;
  const sizeKb = bytes ? Math.ceil(bytes.length / 1024) : 0;

  const { writer, error: writerError, pending } = useQrStreamWriter({
    data: tooLarge ? null : bytes,
    filename,
    preset: "fast",
  });

  useEffect(() => {
    if (!running || !writer || !canvasRef.current) return;

    const controller = renderQrStream({
      packets: writer.packets(),
      canvas: canvasRef.current,
      fps: STREAM_FPS,
      version: PRESETS.fast.version,
    });
    controller.play();

    return () => controller.stop();
  }, [running, writer]);

  useEffect(() => {
    if (!writer) setRunning(false);
  }, [writer]);

  const estimate = writer
    ? estimateTransferSeconds(writer.k, STREAM_FPS)
    : null;

  const handleDownloadShareFile = () => {
    if (!sharedBy) return;
    downloadObjAsJson(buildShareEnvelope(payload, sharedBy), filename);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        maxWidth: "300px",
        color: "#1a1a1a",
        boxSizing: "border-box",
      }}
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            alignSelf: "flex-start",
            background: "none",
            border: "none",
            color: "#2b6cb0",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {t("common.back")}
        </button>
      )}

      <h3 style={{ margin: 0, textAlign: "center" }}>{title}</h3>

      {view === "nametag" ? (
        <NametagForm
          onSaved={() => setView("share")}
          onCancel={() => setView("share")}
        />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setView("nametag")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: "13px",
              color: hasNametag ? "#4a5568" : "#c53030",
              textDecoration: "underline",
            }}
          >
            {hasNametag
              ? t("connect.changeNametag")
              : t("connect.setNametag")}
          </button>

          <div
            style={{
              width: 280,
              height: 280,
              maxWidth: "100%",
              borderRadius: "10px",
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={t("connect.qrAria")}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                imageRendering: "pixelated",
              }}
            />
          </div>

          <span
            role="status"
            aria-live="polite"
            style={{ fontSize: "12px", color: "#4a5568" }}
          >
            {pending
              ? t("connect.preparing")
              : tooLarge
              ? t("connect.tooLarge", { size: sizeKb })
              : writerError
              ? t("connect.unsupported")
              : running
              ? t("connect.streaming")
              : t("connect.readyToStream")}
          </span>

          {!tooLarge && !writerError && estimate !== null && (
            <span style={{ fontSize: "12px", color: "#4a5568" }}>
              {t("connect.estimated", {
                seconds: estimate,
                size: sizeKb,
              })}
            </span>
          )}

          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            disabled={!sharedBy || tooLarge || !writer || !!writerError}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                !sharedBy || tooLarge || !writer || writerError
                  ? "#a0aec0"
                  : running
                  ? "#c53030"
                  : "#2b6cb0",
              color: "#fff",
              fontWeight: 600,
              cursor:
                !sharedBy || tooLarge || !writer || writerError
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {running ? t("connect.stop") : t("connect.start")}
          </button>

          <button
            type="button"
            onClick={handleDownloadShareFile}
            disabled={!sharedBy}
            style={{
              background: "none",
              border: "none",
              color: sharedBy ? "#2b6cb0" : "#a0aec0",
              cursor: sharedBy ? "pointer" : "not-allowed",
              fontSize: "12px",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            {t("connect.downloadShareFile")}
          </button>

          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#718096",
              textAlign: "center",
            }}
          >
            {t("connect.streamHint")}
          </p>
        </>
      )}
    </div>
  );
};
