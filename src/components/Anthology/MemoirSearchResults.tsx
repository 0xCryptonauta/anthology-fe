import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { extractEmbed } from "@src/utils/embeds";
import { matchesSearch } from "@src/utils/searchMatch";
import { EmbedRenderer } from "@src/components/Anthology/Memoirs/thirdPartyEmbeds";
import { Address } from "@src/types/common";
import {
  AnthologyInterface,
  MemoirInterface,
} from "@src/store/slices/anthologySlice";
import { useTranslation } from "@src/i18n/useTranslation";

interface SearchResult {
  anthologyAddr: Address;
  anthologyTitle: string;
  isLocal: boolean;
  title: string;
  content: string;
  index: number;
}

export const MemoirSearchResults = ({ term }: { term: string }) => {
  const { t } = useTranslation();
  const localAnthologies = useAppSelector((s) => s.localAnthology.anthologies);
  const localTitles = useAppSelector((s) => s.localAnthology.contractsTitles);
  const onchainAnthologies = useAppSelector((s) => s.anthology);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const results = useMemo(() => {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) return [];

    const out: SearchResult[] = [];

    (
      Object.entries(localAnthologies) as [Address, MemoirInterface[]][]
    ).forEach(([addr, memoirs]) => {
      memoirs.forEach((memoir, index) => {
        if (
          matchesSearch(memoir.title, normalizedTerm) ||
          matchesSearch(memoir.content, normalizedTerm)
        ) {
          out.push({
            anthologyAddr: addr,
            anthologyTitle: localTitles[addr] || "Untitled anthology",
            isLocal: true,
            title: memoir.title,
            content: memoir.content,
            index,
          });
        }
      });
    });

    (
      Object.entries(onchainAnthologies) as [Address, AnthologyInterface][]
    ).forEach(([addr, data]) => {
      (data.memoirs || []).forEach((memoir, index) => {
        if (
          matchesSearch(memoir.title, normalizedTerm) ||
          matchesSearch(memoir.content, normalizedTerm)
        ) {
          out.push({
            anthologyAddr: addr,
            anthologyTitle: data.anthologyState?.title || "Untitled anthology",
            isLocal: false,
            title: memoir.title,
            content: memoir.content,
            index,
          });
        }
      });
    });

    return out;
  }, [term, localAnthologies, localTitles, onchainAnthologies]);

  const openAnthology = (addr: Address) => {
    dispatch(updateCurrentPath(`contract/${addr}`));
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        margin: "0 auto",
      }}
    >
      <span style={{ textAlign: "center", fontSize: "13px" }}>
        {results.length}{" "}
        {results.length === 1 ? t("search.result") : t("search.results")}
      </span>

      {results.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          {t("search.noMatch", { term: term.trim() })}
        </p>
      ) : (
        results.map((result) => {
          const extracted = extractEmbed(result.content);

          return (
            <div
              key={`${result.anthologyAddr}-${result.index}`}
              style={{
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#333",
              }}
            >
              <span
                translate="no"
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "4px",
                  wordBreak: "break-word",
                }}
              >
                {result.title || t("common.untitled")}
              </span>
              <button
                type="button"
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#2b6cb0",
                  cursor: "pointer",
                  marginBottom: "6px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                }}
                onClick={() => openAnthology(result.anthologyAddr)}
              >
                {result.isLocal ? t("search.local") : t("search.blockchain")} ·{" "}
                <span translate="no">{result.anthologyTitle}</span>
              </button>
              <div translate="no" style={{ fontSize: "0.9rem", wordBreak: "break-word" }}>
                {extracted ? (
                  <>
                    {extracted.caption && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        {extracted.caption}
                      </div>
                    )}
                    <EmbedRenderer embed={extracted.embed} />
                  </>
                ) : (
                  result.content
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
