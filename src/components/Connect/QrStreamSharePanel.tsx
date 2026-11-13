import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MAX_INPUT_BYTES, PRESETS } from "@orozcoh/qr-stream";
import { useQrStreamWriter } from "@orozcoh/qr-stream/react";
import {
  estimateTransferSeconds,
  renderQrStream,
} from "@orozcoh/qr-stream/browser";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { ensureDeviceId, setNametag } from "@src/store/slices/connectSlice";
import {
  buildShareEnvelope,
  validateNametag,
} from "@src/utils/shareEnvelope";
import type { LoadedJson } from "@src/utils/validateJsonContentType";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";
import { useTranslation } from "@src/i18n/useTranslation";

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

  const [draft, setDraft] = useState(nametag);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameInputId = useId();
  const nameErrorId = useId();

  useEffect(() => {
    if (!deviceId) dispatch(ensureDeviceId());
  }, [deviceId, dispatch]);

  useEffect(() => {
    setDraft(nametag);
  }, [nametag]);

  const nameError = validateNametag(draft);
  const nameErrorMessage =
    nameError === "empty"
      ? t("connect.nametagEmpty")
      : nameError === "too-long"
      ? t("connect.nametagTooLong")
      : null;

  const sharedBy = useMemo(
    () =>
      deviceId && !nameError
        ? { deviceId, nametag: draft.trim() }
        : null,
    [deviceId, nameError, draft]
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

  const handleSaveNametag = () => {
    if (nameError) return;
    dispatch(setNametag(draft));
    setDraft(draft.trim());
  };

  const handleDownloadShareFile = () => {
    if (!sharedBy) return;
    downloadObjAsJson(buildShareEnvelope(payload, sharedBy), filename);
  };

  const showNameField = !nametag || draft !== nametag;

  useEffect(() => {
    if (showNameField) nameInputRef.current?.focus();
  }, [showNameField]);

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

      {showNameField && (
        <div style={{ width: "100%", display: "grid", gap: "4px" }}>
          <label htmlFor={nameInputId} style={{ fontSize: "12px", fontWeight: 500 }}>
            {t("connect.nametagLabel")}
          </label>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              ref={nameInputRef}
              id={nameInputId}
              type="text"
              value={draft}
              maxLength={32}
              translate="no"
              aria-invalid={!!nameError}
              aria-describedby={nameErrorMessage ? nameErrorId : undefined}
              onChange={(event) => setDraft(event.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                padding: "8px 10px",
                borderRadius: "6px",
                border: nameError ? "1px solid #dc2626" : "1px solid #ccc",
                fontSize: "14px",
                color: "#1a1a1a",
                backgroundColor: "#fff",
              }}
            />
            <button
              type="button"
              onClick={handleSaveNametag}
              disabled={!!nameError}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: nameError ? "#a0aec0" : "#2b6cb0",
                color: "#fff",
                cursor: nameError ? "not-allowed" : "pointer",
              }}
            >
              {t("common.save")}
            </button>
          </div>
          {nameErrorMessage && (
            <span id={nameErrorId} role="alert" style={{ color: "#dc2626", fontSize: "12px" }}>
              {nameErrorMessage}
            </span>
          )}
        </div>
      )}

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
          style={{ maxWidth: "100%", maxHeight: "100%", imageRendering: "pixelated" }}
        />
      </div>

      <span role="status" aria-live="polite" style={{ fontSize: "12px", color: "#4a5568" }}>
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

      <p style={{ margin: 0, fontSize: "11px", color: "#718096", textAlign: "center" }}>
        {t("connect.streamHint")}
      </p>
    </div>
  );
};
