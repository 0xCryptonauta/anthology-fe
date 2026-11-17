import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { useCameraReader, useQrStreamReader } from "@orozcoh/qr-stream/react";
import { createZXingDecoder } from "@orozcoh/qr-stream/browser/zxing";
import zxingWasmUrl from "zxing-wasm/reader/zxing_reader.wasm?url";
import { Modal } from "../Layout/Modal";
import { PreviewCategoryTree } from "./PreviewCategoryTree";
import { useToast } from "../Layout/Toast";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { markAnthologiesReceived } from "@src/store/slices/localAnthologySlice";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import {
  addMemoryToMemory,
  addOneAnthologyToLocal,
} from "@src/utils/applyLoadedJson";
import {
  decodeSharePayload,
  type SharePayloadKind,
} from "@src/utils/shareEnvelope";
import type { SharedBy } from "@src/types/connect";
import type { LoadedJson } from "@src/utils/validateJsonContentType";
import {
  buildPreviewItems,
  type PreviewAnthology,
} from "@src/utils/previewItems";
import { useTranslation } from "@src/i18n/useTranslation";

const zxingDecoder = () => createZXingDecoder({ wasmUrl: zxingWasmUrl });

const DECODE_ERROR_KEYS = {
  "invalid-json": "connect.decode.invalid-json",
  "invalid-payload": "connect.decode.invalid-payload",
  "missing-sender": "connect.decode.missing-sender",
  "invalid-sender": "connect.decode.invalid-sender",
} as const;

type Phase = "scanning" | "preview" | "error";

const secondaryButtonStyle: CSSProperties = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#edf2f7",
  color: "#1a1a1a",
  fontWeight: 500,
  cursor: "pointer",
};

const ghostButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  backgroundColor: "transparent",
  color: "#2b6cb0",
};

interface ParsedShare {
  kind: SharePayloadKind;
  data: LoadedJson;
  sharedBy: SharedBy;
}

const ScannerView = ({
  onDecoded,
  onClose,
}: {
  onDecoded: (data: Uint8Array) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const {
    progress,
    solveRate,
    result,
    stale,
    error: readerError,
    add,
  } = useQrStreamReader({});
  const {
    videoRef,
    devices,
    cycle,
    switching,
    error: cameraError,
  } = useCameraReader({
    onSymbol: add,
    createDecoder: zxingDecoder,
  });

  useEffect(() => {
    if (result) onDecoded(result.data);
  }, [result, onDecoded]);

  useEffect(() => {
    if (cameraError) console.error("qr-stream camera:", cameraError);
    if (readerError) console.error("qr-stream reader:", readerError);
  }, [cameraError, readerError]);

  const percent =
    progress.k > 0 ? Math.round((progress.solved / progress.k) * 100) : 0;
  const cameraMessage =
    cameraError?.code === "DECODER_FAILED"
      ? t("connect.decoderError")
      : cameraError
      ? t("connect.cameraError")
      : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        color: "#1a1a1a",
      }}
    >
      <h3 style={{ margin: 0, textAlign: "center" }}>
        {t("connect.receiveTitle")}
      </h3>

      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        aria-label={t("connect.cameraPreview")}
        style={{
          width: "100%",
          maxWidth: "300px",
          aspectRatio: "4 / 3",
          objectFit: "cover",
          borderRadius: "10px",
          backgroundColor: "#000",
        }}
      />

      {cameraMessage && (
        <span role="alert" style={{ color: "#c53030", fontSize: "12px" }}>
          {cameraMessage}
        </span>
      )}
      {readerError && (
        <span role="alert" style={{ color: "#c53030", fontSize: "12px" }}>
          {t("connect.readerError")}
        </span>
      )}
      {stale && (
        <span role="status" style={{ color: "#b45309", fontSize: "12px" }}>
          {t("connect.stale")}
        </span>
      )}

      <progress
        value={progress.solved}
        max={Math.max(1, progress.k)}
        aria-valuetext={t("connect.blocks", {
          solved: progress.solved,
          total: progress.k,
          percent,
          rate: solveRate,
        })}
        style={{ width: "100%", maxWidth: "300px" }}
      />
      <span
        role="status"
        aria-live="polite"
        style={{ fontSize: "12px", color: "#4a5568" }}
      >
        {t("connect.blocks", {
          solved: progress.solved,
          total: progress.k,
          percent,
          rate: solveRate,
        })}
      </span>
      <span
        style={{ fontSize: "12px", color: "#718096", textAlign: "center" }}
      >
        {t("connect.scanningHint")}
      </span>

      {devices.length > 1 && (
        <button
          type="button"
          onClick={() => void cycle()}
          disabled={switching}
          style={{
            ...secondaryButtonStyle,
            cursor: switching ? "wait" : "pointer",
            opacity: switching ? 0.6 : 1,
          }}
        >
          {switching ? t("connect.switching") : t("connect.cameraSwitch")}
        </button>
      )}

      <button type="button" onClick={onClose} style={ghostButtonStyle}>
        {t("common.cancel")}
      </button>
    </div>
  );
};

export const QrStreamReceiverModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const ownDeviceId = useAppSelector((state) => state.connect.deviceId);
  const localAnthology = useAppSelector((state) => state.localAnthology);
  const importContext = {
    existingOwn: localAnthology.userContracts?.[LOCAL_USER_ADDR] || [],
    receivedFrom: localAnthology.receivedFrom ?? {},
  };

  const [phase, setPhase] = useState<Phase>("scanning");
  const [parsed, setParsed] = useState<ParsedShare | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleDecoded = useCallback(
    (data: Uint8Array) => {
      const decoded = decodeSharePayload(data);
      if (!decoded.ok) {
        setParseError(t(DECODE_ERROR_KEYS[decoded.reason]));
        setPhase("error");
        return;
      }
      setParsed({
        kind: decoded.kind,
        data: decoded.data,
        sharedBy: decoded.sharedBy,
      });
      setPhase("preview");
    },
    [t]
  );

  const resetToScanning = () => {
    setParsed(null);
    setParseError(null);
    setPhase("scanning");
  };

  const summary = useMemo(() => {
    if (!parsed) {
      return { anthologies: 0, memoirs: 0, items: [] as PreviewAnthology[] };
    }

    const items = buildPreviewItems(parsed.kind, parsed.data);
    return {
      anthologies: items.length,
      memoirs: items.reduce((sum, item) => sum + item.memoirCount, 0),
      items,
    };
  }, [parsed]);

  const handleAccept = () => {
    if (!parsed) return;

    const addresses =
      parsed.kind === "single"
        ? addOneAnthologyToLocal(dispatch, parsed.data, importContext)
        : addMemoryToMemory(dispatch, parsed.data, importContext);

    if (parsed.sharedBy.deviceId !== ownDeviceId) {
      dispatch(
        markAnthologiesReceived({
          addresses,
          deviceId: parsed.sharedBy.deviceId,
          nametag: parsed.sharedBy.nametag,
          receivedAt: Date.now(),
        })
      );
      addToast({
        title: t("connect.imported", { name: parsed.sharedBy.nametag }),
        content: t("connect.importedDesc", {
          anthologies: summary.anthologies,
          memoirs: summary.memoirs,
        }),
        variant: "success",
        delay: 5000,
      });
    } else {
      addToast({
        title: t("connect.selfShare"),
        content: "",
        variant: "info",
      });
    }

    onClose();
  };

  return (
    <Modal
      show
      onHide={onClose}
      height="90dvh"
      maxWidth="min(362px, calc(100vw - 10px))"
      bodyPadding="0"
      contentPadding="5px"
      contentMargin="0"
    >
      {phase === "scanning" ? (
        <ScannerView onDecoded={handleDecoded} onClose={onClose} />
      ) : phase === "error" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            color: "#1a1a1a",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{t("connect.receiveTitle")}</h3>
          <p role="alert" style={{ margin: 0, color: "#c53030" }}>
            {parseError}
          </p>
          <button
            type="button"
            onClick={resetToScanning}
            style={secondaryButtonStyle}
          >
            {t("connect.scanAgain")}
          </button>
          <button type="button" onClick={onClose} style={ghostButtonStyle}>
            {t("common.cancel")}
          </button>
        </div>
      ) : parsed ? (
        <div
          data-preview-phase
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            color: "#1a1a1a",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{t("connect.reviewTitle")}</h3>
          <p style={{ margin: 0, lineHeight: 1.3 }}>
            <span
              translate="no"
              style={{
                fontWeight: 700,
                fontSize: "20px",
                color: "#166534",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                overflowWrap: "anywhere",
              }}
            >
              {parsed.sharedBy.nametag}
            </span>{" "}
            {t("connect.wantsToConnect")}
          </p>
          <p style={{ margin: 0 }}>
            {t("connect.previewCounts", {
              anthologies: summary.anthologies,
              memoirs: summary.memoirs,
            })}
          </p>
          {summary.items.length > 0 && (
            <div
              data-preview-scroll
              style={{
                width: "100%",
                maxHeight: "min(40dvh, 360px)",
                overflowY: "auto",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                boxSizing: "border-box",
              }}
            >
              <PreviewCategoryTree
                items={summary.items}
                single={parsed.kind === "single"}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleAccept}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2b6cb0",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("connect.addToMemory")}
          </button>
          <button
            type="button"
            onClick={resetToScanning}
            style={secondaryButtonStyle}
          >
            {t("connect.scanAgain")}
          </button>
          <button type="button" onClick={onClose} style={ghostButtonStyle}>
            {t("common.cancel")}
          </button>
        </div>
      ) : null}
    </Modal>
  );
};
