import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { extractEmbed } from "@src/utils/embeds";
import { EmbedRenderer } from "@src/components/Anthology/Memoirs/thirdPartyEmbeds";
import { Address } from "@src/types/common";
import { MemoirInterface, AnthologyInterface } from "@src/store/slices/anthologySlice";
import { Seo } from "@components/Layout/Seo";

interface SearchResult {
  anthologyAddr: Address;
  anthologyTitle: string;
  isLocal: boolean;
  title: string;
  content: string;
  index: number;
}

export const SearchView = () => {
  const [search, setSearch] = useState("");

  const localAnthologies = useAppSelector((s) => s.localAnthology.anthologies);
  const localTitles = useAppSelector((s) => s.localAnthology.contractsTitles);
  const onchainAnthologies = useAppSelector((s) => s.anthology);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];

    const out: SearchResult[] = [];

    (
      Object.entries(localAnthologies) as [Address, MemoirInterface[]][]
    ).forEach(([addr, memoirs]) => {
      memoirs.forEach((memoir, index) => {
        if (
          memoir.title.toLowerCase().includes(term) ||
          memoir.content.toLowerCase().includes(term)
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
          memoir.title.toLowerCase().includes(term) ||
          memoir.content.toLowerCase().includes(term)
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
  }, [search, localAnthologies, localTitles, onchainAnthologies]);

  const openAnthology = (addr: Address) => {
    dispatch(updateCurrentPath(`contract/${addr}`));
    navigate("/");
  };

  return (
    <>
      <Seo
        title="Search"
        description="Search memoirs across all your anthologies"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all memoirs by title or content..."
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            fontSize: "14px",
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#111",
            outline: "none",
          }}
        />

        {search.trim() && (
          <div
            style={{
              marginTop: "16px",
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span style={{ textAlign: "center", fontSize: "13px" }}>
              {results.length} {results.length === 1 ? "result" : "results"}
            </span>

            {results.length === 0 ? (
              <p style={{ textAlign: "center" }}>
                No memoirs match "{search.trim()}".
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
                      style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: "4px",
                        wordBreak: "break-word",
                      }}
                    >
                      {result.title || "Untitled"}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#2b6cb0",
                        cursor: "pointer",
                        marginBottom: "6px",
                      }}
                      onClick={() => openAnthology(result.anthologyAddr)}
                    >
                      {result.isLocal ? "Local" : "On-chain"} ·{" "}
                      {result.anthologyTitle}
                    </span>
                    <div
                      style={{ fontSize: "0.9rem", wordBreak: "break-word" }}
                    >
                      {extracted ? (
                        <>
                          <EmbedRenderer embed={extracted.embed} />
                          {extracted.caption && (
                            <div style={{ marginTop: "0.5rem" }}>
                              {extracted.caption}
                            </div>
                          )}
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
        )}
      </div>
    </>
  );
};
