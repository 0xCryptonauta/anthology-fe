import { useState } from "react";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useOrderedMemoirs } from "@src/hooks/useOrderedMemoirs";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { useAccount } from "wagmi";
import { MemoirActions } from "../../MemoirActions";
import { formatUnixTime } from "@utils/formatUnixTime";
import { extractEmbed } from "@src/utils/embeds";
import { EmbedRenderer } from "../thirdPartyEmbeds";

interface ListMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}

export const ListMemoirSkin: React.FC<ListMemoirSkinProps> = ({
  anthologyAddr,
  order,
  search,
}) => {
  const { memoirs, orderedMemoirsIndexes } = useOrderedMemoirs(
    anthologyAddr,
    order,
    search
  );
  const [expandedMemoirs, setExpandedMemoirs] = useState<
    Record<number, boolean>
  >({});

  const { address: currentUser } = useAccount();
  const anthologyOwner = useAppSelector(
    (state) => state.anthology[anthologyAddr]?.anthologyState?.owner
  );

  if (!memoirs || memoirs.length === 0) {
    return <p style={{ margin: "30px" }}>No memoirs available.</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {orderedMemoirsIndexes.map((i, index) => {
        const { title, content } = memoirs[i];
        const extracted = extractEmbed(content);
        const isExpanded = !!expandedMemoirs[i];

        return (
          <div
            key={i}
            style={{
              width: "100%",
              minWidth: "300px",
              maxWidth: "600px",
              marginBottom: "1.5rem",
              padding: "0.5rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: "#333",
                display: "block",
                marginBottom: "0.25rem",
                wordBreak: "break-word",
                cursor: extracted ? "pointer" : "default",
              }}
              onClick={
                extracted
                  ? () =>
                      setExpandedMemoirs((prev) => ({
                        ...prev,
                        [i]: !prev[i],
                      }))
                  : undefined
              }
            >
              {index + 1}. {title || "Untitled"}
              {extracted && <span>{isExpanded ? " ▾" : " ▸"}</span>}
            </span>

            <div
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                color: "#555",
                fontSize: "0.9rem",
                wordBreak: "break-word",
              }}
            >
              {isExpanded && extracted ? (
                <>
                  {extracted.caption && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      {extracted.caption}
                    </div>
                  )}
                  <EmbedRenderer embed={extracted.embed} />
                </>
              ) : (
                content
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "12px",
                color: "#666",
                marginTop: "8px",
              }}
            >
              <span>{formatUnixTime(Number(memoirs[i].timestamp))}</span>

              {(currentUser === anthologyOwner ||
                isLocalAnthology(anthologyAddr) ||
                currentUser === memoirs[i].sender) && (
                <div style={{ marginTop: "6px" }}>
                  <MemoirActions
                    anthologyAddr={anthologyAddr}
                    index={i}
                    memoir={memoirs[i]}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
