import { shortenAddress } from "@utils/shortenAddress";
import { formatUnixTime } from "@utils/formatUnixTime";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import { EmbedRenderer } from "../thirdPartyEmbeds";
import { detectEmbed } from "@src/utils/embeds";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useOrderedMemoirs } from "@src/hooks/useOrderedMemoirs";
import { useAccount } from "wagmi";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { DeleteMemoir } from "../../DeleteMemoir";
import { LOCAL_USER_ADDR } from "@src/utils/constants";

interface MediaMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
}

export const MediaMemoirSkin: React.FC<MediaMemoirSkinProps> = ({
  anthologyAddr,
  order,
}) => {
  const { memoirs, orderedMemoirsIndexes } = useOrderedMemoirs(
    anthologyAddr,
    order
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

        const embed = detectEmbed(memoir.content);

        const renderContent = () => {
          if (embed) return <EmbedRenderer embed={embed} />;

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
              style={{
                textAlign: "center",
                wordBreak: "break-word",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#333",
              }}
            >
              {memoir.title || "Untitled"}
            </div>

            <div
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
                width: "300px",
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
            </div>

            {(currentUser === anthologyOwner ||
              isLocalAnthology(anthologyAddr) ||
              currentUser === memoir.sender) && (
              <div
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                }}
                /* onClick={() =>
                  handleDelete({
                    anthologyAddr,
                    index: i,
                  })
                } */
              >
                <DeleteMemoir anthologyAddr={anthologyAddr} index={i} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
