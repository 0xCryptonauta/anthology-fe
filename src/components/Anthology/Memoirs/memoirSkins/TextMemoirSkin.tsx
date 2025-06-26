import { shortenAddress } from "@utils/shortenAddress";
import { formatUnixTime } from "@utils/formatUnixTime";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { useOrderedMemoirs } from "@src/hooks/useOrderedMemoirs";
import { useAccount } from "wagmi";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";

interface TextMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  handleDelete: (object: HandleDeleteProps) => void;
}
interface HandleDeleteProps {
  anthologyAddr: Address;
  index: number;
}

export const TextMemoirSkin: React.FC<TextMemoirSkinProps> = ({
  anthologyAddr,
  order,
  handleDelete,
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
        width: "100vh",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around",
        color: "black",
      }}
    >
      {orderedMemoirsIndexes.map((i) => {
        const memoir = memoirs[i];

        const isDeletable =
          currentUser === anthologyOwner ||
          isLocalAnthology(anthologyAddr) ||
          currentUser === memoir.sender;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              padding: "12px",
              margin: "15px 1px",
              width: "360px",
              position: "relative",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Title */}
            <div
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
              {memoir.title || "Untitled"}
            </div>

            {/* Content */}
            <div
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
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(updateCurrentPath(`user/${memoir.sender}`))
                }
              >
                {shortenAddress(memoir.sender, 10, 8)}
              </span>
              <span>{formatUnixTime(Number(memoir.timestamp))}</span>
            </div>

            {/* Delete Button */}
            {isDeletable && (
              <span
                title="Delete memoir"
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
                  fontSize: "16px",
                  color: "#cc0000",
                }}
                onClick={() =>
                  handleDelete({
                    anthologyAddr,
                    index: i,
                  })
                }
              >
                ❌
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
