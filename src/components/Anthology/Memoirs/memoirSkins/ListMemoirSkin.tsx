import { memo, useCallback, useState } from "react";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useInfiniteMemoirs } from "@src/hooks/useInfiniteMemoirs";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { useAccount } from "wagmi";
import { MemoirActions } from "../../MemoirActions";
import { formatUnixTime } from "@utils/formatUnixTime";
import { extractEmbed } from "@src/utils/embeds";
import { EmbedRenderer } from "../thirdPartyEmbeds";
import { InfiniteMemoirLoader } from "../InfiniteMemoirLoader";
import { useTranslation } from "@src/i18n/useTranslation";
import { MemoirInterface } from "@src/store/slices/anthologySlice";

interface ListMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}

interface ListMemoirCardProps {
  memoir: MemoirInterface;
  index: number;
  position: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
  anthologyAddr: Address;
  currentUser?: Address;
  anthologyOwner?: Address;
  isLocal: boolean;
}

const ListMemoirCard = memo(
  ({
    memoir,
    index,
    position,
    isExpanded,
    onToggle,
    anthologyAddr,
    currentUser,
    anthologyOwner,
    isLocal,
  }: ListMemoirCardProps) => {
    const { t } = useTranslation();
    const { title, content } = memoir;
    const extracted = extractEmbed(content);

    return (
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          minWidth: 0,
          // Cards are size-contained by content-visibility while off-screen.
          // Without inline-size containment, a long unbroken URL contributes
          // its full min-content width as soon as the card scrolls into view,
          // widening the page (and every width:100% card) on mobile.
          contain: "inline-size",
          marginBottom: "1.5rem",
          padding: "0.5rem",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          position: "relative",
          contentVisibility: "auto",
          containIntrinsicSize: "auto 160px",
        }}
      >
        <button
          type="button"
          translate="no"
          aria-expanded={extracted ? isExpanded : undefined}
          style={{
            fontWeight: "600",
            fontSize: "1rem",
            color: "#333",
            display: "block",
            marginBottom: "0.25rem",
            // anywhere (not just break-word) removes the URL from the card's
            // min-content size, keeping the page width stable while scrolling.
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            textAlign: "center",
            cursor: extracted ? "pointer" : "default",
            background: "none",
            border: "none",
            width: "100%",
            padding: 0,
          }}
          onClick={extracted ? () => onToggle(index) : undefined}
        >
          {position}. {title || t("common.untitled")}
          {extracted && (
            <span aria-hidden="true">{isExpanded ? " ▾" : " ▸"}</span>
          )}
        </button>

        <div
          translate="no"
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
            color: "#555",
            fontSize: "0.9rem",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            textAlign: "center",
          }}
        >
          {isExpanded && extracted ? (
            <>
              {extracted.caption && (
                <div style={{ marginBottom: "0.5rem", whiteSpace: "pre-wrap" }}>
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
          <span>{formatUnixTime(Number(memoir.timestamp))}</span>

          {(currentUser === anthologyOwner ||
            isLocal ||
            currentUser === memoir.sender) && (
            <div style={{ marginTop: "6px" }}>
              <MemoirActions
                anthologyAddr={anthologyAddr}
                index={index}
                memoir={memoir}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export const ListMemoirSkin: React.FC<ListMemoirSkinProps> = ({
  anthologyAddr,
  order,
  search,
}) => {
  const { t } = useTranslation();
  const {
    memoirs,
    visibleIndexes,
    total,
    loadedCount,
    hasMore,
    isPending,
    filterKey,
    loadMore,
  } = useInfiniteMemoirs(anthologyAddr, order, search);
  const [expandedMemoirs, setExpandedMemoirs] = useState<
    Record<number, boolean>
  >({});

  const { address: currentUser } = useAccount();
  const anthologyOwner = useAppSelector(
    (state) => state.anthology[anthologyAddr]?.anthologyState?.owner
  );
  const isLocal = isLocalAnthology(anthologyAddr);

  const toggleExpanded = useCallback((index: number) => {
    setExpandedMemoirs((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  if (!memoirs || memoirs.length === 0) {
    return <p style={{ margin: "30px" }}>{t("memoirs.none")}</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {visibleIndexes.map((i, position) => (
        <ListMemoirCard
          key={i}
          memoir={memoirs[i]}
          index={i}
          position={position + 1}
          isExpanded={!!expandedMemoirs[i]}
          onToggle={toggleExpanded}
          anthologyAddr={anthologyAddr}
          currentUser={currentUser}
          anthologyOwner={anthologyOwner}
          isLocal={isLocal}
        />
      ))}

      <InfiniteMemoirLoader
        hasMore={hasMore}
        isPending={isPending}
        loadedCount={loadedCount}
        total={total}
        filterKey={filterKey}
        onLoadMore={loadMore}
      />
    </div>
  );
};
