import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type RefObject,
} from "react";
import { useCameraReader, useQrStreamReader } from "@orozcoh/qr-stream/react";
import { createZXingDecoder } from "@orozcoh/qr-stream/browser/zxing";
import zxingWasmUrl from "zxing-wasm/reader/zxing_reader.wasm?url";
import { Modal } from "../Layout/Modal";
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
import type { Address } from "@src/types/common";
import type { LoadedJson } from "@src/utils/validateJsonContentType";
import { useTranslation } from "@src/i18n/useTranslation";

const zxingDecoder = () => createZXingDecoder({ wasmUrl: zxingWasmUrl });

const DECODE_ERROR_KEYS = {
  "invalid-json": "connect.decode.invalid-json",
  "invalid-payload": "connect.decode.invalid-payload",
  "missing-sender": "connect.decode.missing-sender",
  "invalid-sender": "connect.decode.invalid-sender",
} as const;

type Phase = "scanning" | "preview" | "error";

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
    cameraError && /decoder|wasm|zxing/i.test(cameraError)
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
        // qr-stream types the ref as React 19's nullable RefObject; the
        // runtime ref is the same HTMLVideoElement under React 18.
        ref={videoRef as RefObject<HTMLVideoElement>}
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
          style={{ cursor: switching ? "wait" : "pointer" }}
        >
          {switching ? t("connect.switching") : t("connect.cameraSwitch")}
        </button>
      )}

      <button type="button" onClick={onClose}>
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
      return { anthologies: 0, memoirs: 0, titles: [] as string[] };
    }

    if (parsed.kind === "single" && parsed.data.anthology) {
      return {
        anthologies: 1,
        memoirs: parsed.data.anthology.anthology.length,
        titles: [parsed.data.anthology.title],
      };
    }

    const local = parsed.data.localMemory;
    const entries = Object.entries(local?.anthologies ?? {});
    return {
      anthologies: entries.length,
      memoirs: entries.reduce((sum, [, memoirs]) => sum + memoirs.length, 0),
      titles: entries
        .map(
          ([address]) =>
            local?.contractsTitles[address as Address] || address
        )
        .slice(0, 5),
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
    <Modal show onHide={onClose}>
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
          <button type="button" onClick={resetToScanning}>
            {t("connect.scanAgain")}
          </button>
          <button type="button" onClick={onClose}>
            {t("common.cancel")}
          </button>
        </div>
      ) : parsed ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            color: "#1a1a1a",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{t("connect.reviewTitle")}</h3>
          <p style={{ margin: 0 }}>
            <span translate="no">{parsed.sharedBy.nametag}</span>{" "}
            {t("connect.wantsToConnect")}
          </p>
          <p style={{ margin: 0 }}>
            {t("connect.previewCounts", {
              anthologies: summary.anthologies,
              memoirs: summary.memoirs,
            })}
          </p>
          {summary.titles.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: "18px", textAlign: "left" }}>
              {summary.titles.map((title, index) => (
                <li key={`${title}-${index}`} translate="no">
                  {title}
                </li>
              ))}
            </ul>
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
          <button type="button" onClick={resetToScanning}>
            {t("connect.scanAgain")}
          </button>
          <button type="button" onClick={onClose}>
            {t("common.cancel")}
          </button>
        </div>
      ) : null}
    </Modal>
  );
};
