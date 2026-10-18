import { shortenAddress } from "@utils/shortenAddress";
import { formatUnixTime } from "@utils/formatUnixTime";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import { EmbedRenderer } from "../thirdPartyEmbeds";
import { extractEmbed } from "@src/utils/embeds";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useOrderedMemoirs } from "@src/hooks/useOrderedMemoirs";
import { useAccount } from "wagmi";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { MemoirActions } from "../../MemoirActions";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useTranslation } from "@src/i18n/useTranslation";

interface MediaMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}

export const MediaMemoirSkin: React.FC<MediaMemoirSkinProps> = ({
  anthologyAddr,
  order,
  search,
}) => {
  const { t } = useTranslation();
  const { memoirs, orderedMemoirsIndexes } = useOrderedMemoirs(
    anthologyAddr,
    order,
    search
  );
  const { address: currentUser } = useAccount();
  const anthologyOwner = useAppSelector(
    (state) => state.anthology[anthologyAddr]?.anthologyState?.owner
  );

  const dispatch = useAppDispatch();

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
      {orderedMemoirsIndexes.map((i) => {
        const memoir = memoirs[i];

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
            key={i}
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
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    dispatch(updateCurrentPath(`user/${memoir.sender}`))
                  }
                >
                  {shortenAddress(memoir.sender, 10, 8)}
                </span>
              )}

              <span>{formatUnixTime(Number(memoir.timestamp))}</span>

              {(currentUser === anthologyOwner ||
                isLocalAnthology(anthologyAddr) ||
                currentUser === memoir.sender) && (
                <div style={{ marginTop: "6px" }}>
                  <MemoirActions
                    anthologyAddr={anthologyAddr}
                    index={i}
                    memoir={memoir}
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
