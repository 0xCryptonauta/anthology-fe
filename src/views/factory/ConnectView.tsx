import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { ensureDeviceId } from "@src/store/slices/connectSlice";
import { groupConnections } from "@src/utils/groupConnections";
import { QrStreamReceiverModal } from "@src/components/Connect/QrStreamReceiverModal";
import { ConnectContactSection } from "@src/components/Connect/ConnectContactSection";
import { useTranslation } from "@src/i18n/useTranslation";

export const ConnectView = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { nametag, deviceId } = useAppSelector((state) => state.connect);
  const receivedFrom = useAppSelector(
    (state) => state.localAnthology.receivedFrom ?? {}
  );
  const anthologies = useAppSelector(
    (state) => state.localAnthology.anthologies
  );
  const contractsTitles = useAppSelector(
    (state) => state.localAnthology.contractsTitles
  );
  const [receiverOpen, setReceiverOpen] = useState(false);

  useEffect(() => {
    if (!deviceId) dispatch(ensureDeviceId());
  }, [deviceId, dispatch]);

  const groups = useMemo(
    () => groupConnections(receivedFrom, anthologies, contractsTitles),
    [receivedFrom, anthologies, contractsTitles]
  );
  const nametagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const group of groups) {
      counts[group.nametag] = (counts[group.nametag] ?? 0) + 1;
    }
    return counts;
  }, [groups]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        color: "white",
        gap: "14px",
        textAlign: "center",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <h1 style={{ margin: 0 }}>{t("connect.title")}</h1>
      <p style={{ margin: 0, color: "#cbd5e1" }}>{t("connect.subtitle")}</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
        }}
      >
        <span>{t("connect.yourNamePrefix")}</span>
        <span translate="no" style={{ fontWeight: 600 }}>
          {nametag || "—"}
        </span>
        <Link to="/settings" style={{ color: "#7dd3fc" }}>
          {t("connect.changeNametag")}
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setReceiverOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "rgb(143 200 129)",
          color: "#111",
          fontWeight: 600,
          fontSize: "15px",
          cursor: "pointer",
        }}
      >
        <img
          src="/icons/qrIcon.svg"
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          style={{ borderRadius: "3px" }}
        />
        {t("connect.scan")}
      </button>

      {groups.length === 0 ? (
        <p style={{ margin: 0, maxWidth: "420px", color: "#94a3b8" }}>
          {t("connect.empty")}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            marginTop: "8px",
          }}
        >
          {groups.map((group) => (
            <ConnectContactSection
              key={group.deviceId}
              group={group}
              hasDuplicateNametag={(nametagCounts[group.nametag] ?? 0) > 1}
            />
          ))}
        </div>
      )}

      {receiverOpen && (
        <QrStreamReceiverModal onClose={() => setReceiverOpen(false)} />
      )}
    </div>
  );
};
