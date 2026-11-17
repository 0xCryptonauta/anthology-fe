import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { ensureDeviceId } from "@src/store/slices/connectSlice";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import type { Address, CurrentPaths } from "@src/types/common";
import { groupConnections } from "@src/utils/groupConnections";
import { parseContractTitle } from "@src/utils/parseContractsCategories";
import { searchConnectedAnthologies } from "@src/utils/searchConnectedAnthologies";
import { shortenAddress } from "@src/utils/shortenAddress";
import { QrStreamReceiverModal } from "@src/components/Connect/QrStreamReceiverModal";
import { ConnectContactSection } from "@src/components/Connect/ConnectContactSection";
import { useTranslation } from "@src/i18n/useTranslation";

export const ConnectView = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { deviceId } = useAppSelector((state) => state.connect);
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
  const [query, setQuery] = useState("");

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

  const searchResults = useMemo(
    () => searchConnectedAnthologies(groups, query),
    [groups, query]
  );
  const isSearching = query.trim().length > 0;

  const openAnthology = (address: Address) => {
    const path = `contract/${address}` as CurrentPaths;
    dispatch(updateCurrentPath(path));
    window.history.pushState(
      { currentPath: path },
      "",
      window.location.pathname
    );
  };

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

      {groups.length > 0 && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("connect.searchPlaceholder")}
            aria-label={t("connect.searchPlaceholder")}
            autoComplete="off"
            enterKeyHint="search"
            style={{
              width: "100%",
              minHeight: "44px",
              padding: "10px 46px 10px 12px",
              borderRadius: "8px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "white",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("connect.searchClear")}
              style={{
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                border: "none",
                background: "transparent",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {groups.length === 0 ? (
        <p style={{ margin: 0, maxWidth: "420px", color: "#94a3b8" }}>
          {t("connect.empty")}
        </p>
      ) : isSearching ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            marginTop: "8px",
            textAlign: "left",
          }}
        >
          {searchResults.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p role="status" style={{ margin: 0, color: "#94a3b8" }}>
                {t("connect.searchNoResults", { query: query.trim() })}
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  backgroundColor: "transparent",
                  color: "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {t("connect.searchClear")}
              </button>
            </div>
          ) : (
            <>
              <p
                role="status"
                style={{ margin: 0, color: "#94a3b8", fontSize: "13px" }}
              >
                {searchResults.length === 1
                  ? t("connect.anthologyCountOne")
                  : t("connect.anthologyCount", {
                      count: searchResults.length,
                    })}
              </p>
              {searchResults.map((result) => {
                const parsed = parseContractTitle(result.title);
                const label = parsed.title.trim()
                  ? parsed.title
                  : shortenAddress(result.address, 12, 9);
                const breadcrumb = [parsed.category, parsed.subcategory]
                  .filter(Boolean)
                  .join(" › ");

                return (
                  <button
                    key={result.address}
                    type="button"
                    onClick={() => openAnthology(result.address)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "1px solid #334155",
                      backgroundColor: "#161b22",
                      color: "white",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        minWidth: 0,
                      }}
                    >
                      {breadcrumb && (
                        <span
                          translate="no"
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                          }}
                        >
                          {breadcrumb}
                        </span>
                      )}
                      <span
                        translate="no"
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {label}
                      </span>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "2px",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        translate="no"
                        style={{ fontSize: "12px", color: "#cbd5e1" }}
                      >
                        {result.nametag}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {result.memoirCount === 1
                          ? t("connect.memoirCountOne")
                          : t("connect.memoirCount", {
                              count: result.memoirCount,
                            })}
                      </span>
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>
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
