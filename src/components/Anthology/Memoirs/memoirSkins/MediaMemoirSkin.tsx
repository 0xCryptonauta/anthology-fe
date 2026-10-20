import { memo } from "react";
import { shortenAddress } from "@utils/shortenAddress";
import { formatUnixTime } from "@utils/formatUnixTime";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import { EmbedRenderer } from "../thirdPartyEmbeds";
import { InfiniteMemoirLoader } from "../InfiniteMemoirLoader";
import { extractEmbed } from "@src/utils/embeds";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useInfiniteMemoirs } from "@src/hooks/useInfiniteMemoirs";
import { useAccount } from "wagmi";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { MemoirActions } from "../../MemoirActions";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useTranslation } from "@src/i18n/useTranslation";
import { MemoirInterface } from "@src/store/slices/anthologySlice";

interface MediaMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}

interface MediaMemoirCardProps {
  memoir: MemoirInterface;
  index: number;
  anthologyAddr: Address;
  currentUser?: Address;
  anthologyOwner?: Address;
  isLocal: boolean;
}

const MediaMemoirCard = memo(
  ({
    memoir,
    index,
    anthologyAddr,
    currentUser,
    anthologyOwner,
    isLocal,
  }: MediaMemoirCardProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const extracted = extractEmbed(memoir.content);

    const renderContent = () => {
      if (extracted)
        return (
          <>
            {extracted.caption && (
              <div
                style={{ marginBottom: "0.5rem", overflowWrap: "break-word" }}
              >
                {extracted.caption}
              </div>
            )}
            <EmbedRenderer embed={extracted.embed} />
          </>
        );

      return isValidURL(memoir.content) ? (
        <a
          href={memoir.content}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#666" }}
        >
          {memoir.content}
        </a>
      ) : (
        <span>{memoir.content}</span>
      );
    };

    return (
      <div
        style={{
          width: "100%",
          maxWidth: "340px",
          padding: "12px",
          margin: "15px 0px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          position: "relative",
          contentVisibility: "auto",
          containIntrinsicSize: "auto 320px",
        }}
      >
        <div
          translate="no"
          style={{
            textAlign: "center",
            wordBreak: "break-word",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#333",
          }}
        >
          {memoir.title || t("common.untitled")}
        </div>

        <div
          translate="no"
          style={{
            textAlign: "center",
            wordBreak: "break-word",
            marginBottom: "0.5rem",
          }}
        >
          {renderContent()}
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "300px",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          {currentUser === LOCAL_USER_ADDR && (
            <button
              type="button"
              className="bg-transparent border-none p-0"
              style={{ cursor: "pointer", color: "#666" }}
              onClick={() =>
                dispatch(updateCurrentPath(`user/${memoir.sender}`))
              }
            >
              {shortenAddress(memoir.sender, 10, 8)}
            </button>
          )}

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

export const MediaMemoirSkin: React.FC<MediaMemoirSkinProps> = ({
  anthologyAddr,
  order,
  search,
}) => {
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
  const { address: currentUser } = useAccount();
  const anthologyOwner = useAppSelector(
    (state) => state.anthology[anthologyAddr]?.anthologyState?.owner
  );
  const isLocal = isLocalAnthology(anthologyAddr);

  return (
    <div
      style={{
        padding: "20px 16px",
        display: "flex",
        width: "95vw",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around",
        color: "black",
      }}
    >
      {visibleIndexes.map((i) => (
        <MediaMemoirCard
          key={i}
          memoir={memoirs[i]}
          index={i}
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
