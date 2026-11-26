import { useEffect, useMemo, useRef, useState } from "react";
import { useQrStreamWriter } from "@orozcoh/qr-stream/react";
import {
  estimateTransferSeconds,
  quantizeFps,
  renderQrStream,
  type RenderController,
} from "@orozcoh/qr-stream/browser";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { ensureDeviceId } from "@src/store/slices/connectSlice";
import { buildShareEnvelope } from "@src/utils/shareEnvelope";
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

// 10 fps is the mobile-safe default; the slider can raise it live.
const DEFAULT_STREAM_FPS = 10;
// Keep the 0.2 transfer budget while piloting 1.0. The wire cap is still 1 MiB
// compressed, and this panel has no separate compressed-size estimate.
const SHARE_INPUT_LIMIT = 1024 * 1024;

export const QrStreamSharePanel = ({
  payload,
  filename,
  title,
  onBack,
}: QrStreamSharePanelProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { deviceId, nametag } = useAppSelector((state) => state.connect);

  const [view, setView] = useState<"share" | "nametag">("share");
  const [fps, setFps] = useState(DEFAULT_STREAM_FPS);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveControllerRef = useRef<RenderController | null>(null);
  const fpsRef = useRef(fps);

  useEffect(() => {
    if (!deviceId) dispatch(ensureDeviceId());
  }, [deviceId, dispatch]);

  // Legacy nametags (up to 32 chars) still share; only the editor caps at 13.
  const hasNametag = nametag.trim().length > 0;

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

  const tooLarge = bytes !== null && bytes.length > SHARE_INPUT_LIMIT;
  const sizeKb = bytes ? Math.ceil(bytes.length / 1024) : 0;

  const { writer, error: writerError, pending } = useQrStreamWriter({
    data: tooLarge ? null : bytes,
    filename,
    preset: "balanced",
    limits: { maxInputBytes: SHARE_INPUT_LIMIT },
  });

  const overBudget =
    tooLarge ||
    writerError?.code === "WIRE_TOO_LARGE" ||
    writerError?.code === "INPUT_TOO_LARGE";

  useEffect(() => {
    fpsRef.current = fps;
    liveControllerRef.current?.setFps(fps);
  }, [fps]);

  useEffect(() => {
    if (view !== "share" || !writer || !canvasRef.current) return;

    const controller = renderQrStream({
      writer,
      canvas: canvasRef.current,
      fps: fpsRef.current,
    });
    liveControllerRef.current = controller;
    controller.play();

    return () => {
      controller.stop();
      liveControllerRef.current = null;
    };
  }, [view, writer]);

  const effectiveFps = quantizeFps(fps);
  const estimate = writer
    ? estimateTransferSeconds(writer.k, effectiveFps)
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
          <div
            style={{
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: "100%",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              {t("connect.sharingAs")}
            </div>
            <div
              translate="no"
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: hasNametag ? "#166534" : "#c53030",
                overflowWrap: "anywhere",
              }}
            >
              {hasNametag ? nametag : t("settings.notSet")}
            </div>
          </div>

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
              : overBudget
              ? t("connect.tooLarge", { size: sizeKb })
              : writerError
              ? t("connect.unsupported")
              : t("connect.streaming")}
          </span>

          {!overBudget && !writerError && estimate !== null && (
            <span style={{ fontSize: "12px", color: "#4a5568" }}>
              {t("connect.estimated", {
                seconds: estimate,
                size: sizeKb,
              })}
            </span>
          )}

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              width: "100%",
              fontSize: "12px",
              color: "#4a5568",
            }}
          >
            <span>
              {t("connect.streamSpeed")} · {effectiveFps} fps
            </span>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={fps}
              onChange={(event) => setFps(Number(event.target.value))}
              disabled={!writer || !!writerError || overBudget}
              aria-label={t("connect.streamSpeed")}
              style={{
                width: "100%",
                accentColor: "#2b6cb0",
                cursor:
                  !writer || writerError || overBudget
                    ? "not-allowed"
                    : "pointer",
              }}
            />
          </label>

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
