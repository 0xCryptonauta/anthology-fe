import { memo } from "react";
import { shortenAddress } from "@utils/shortenAddress";
import { formatUnixTime } from "@utils/formatUnixTime";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useInfiniteMemoirs } from "@src/hooks/useInfiniteMemoirs";
import { useAccount } from "wagmi";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { MemoirActions } from "../../MemoirActions";
import { InfiniteMemoirLoader } from "../InfiniteMemoirLoader";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useTranslation } from "@src/i18n/useTranslation";
import { MemoirInterface } from "@src/store/slices/anthologySlice";

interface TextMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}

interface TextMemoirCardProps {
  memoir: MemoirInterface;
  index: number;
  anthologyAddr: Address;
  currentUser?: Address;
  anthologyOwner?: Address;
  isLocal: boolean;
}

const TextMemoirCard = memo(
  ({
    memoir,
    index,
    anthologyAddr,
    currentUser,
    anthologyOwner,
    isLocal,
  }: TextMemoirCardProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const isDeletable =
      currentUser === anthologyOwner ||
      isLocal ||
      currentUser === memoir.sender;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          padding: "12px",
          margin: "15px 1px",
          width: "100%",
          maxWidth: "360px",
          boxSizing: "border-box",
          position: "relative",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
          contentVisibility: "auto",
          containIntrinsicSize: "auto 220px",
        }}
      >
        {/* Title */}
        <div
          translate="no"
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1rem",
            marginBottom: "6px",
            wordBreak: "break-word",
            maxWidth: "340px",
            color: "black",
          }}
        >
          {memoir.title || t("common.untitled")}
        </div>

        {/* Content */}
        <div
          translate="no"
          style={{
            textAlign: "center",
            padding: "6px 0",
            margin: "0 5px",
            fontSize: "0.95rem",
            wordBreak: "break-word",
            maxWidth: "340px",
            color: "black",
          }}
        >
          {isValidURL(memoir.content) ? (
            <a
              href={memoir.content}
              target="_blank"
              rel="noopener noreferrer"
            >
              {memoir.content}
            </a>
          ) : (
            <span>{memoir.content}</span>
          )}
        </div>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "12px",
            color: "black",
            marginTop: "8px",
          }}
        >
          {currentUser === LOCAL_USER_ADDR && (
            <button
              type="button"
              className="bg-transparent border-none p-0"
              style={{ cursor: "pointer", color: "black" }}
              onClick={() =>
                dispatch(updateCurrentPath(`user/${memoir.sender}`))
              }
            >
              {shortenAddress(memoir.sender, 10, 8)}
            </button>
          )}

          <span>{formatUnixTime(Number(memoir.timestamp))}</span>

          {isDeletable && (
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

export const TextMemoirSkin: React.FC<TextMemoirSkinProps> = ({
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
        <TextMemoirCard
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
