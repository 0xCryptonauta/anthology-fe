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
import { MemoirActions } from "../../MemoirActions";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useTranslation } from "@src/i18n/useTranslation";

interface TextMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}

export const TextMemoirSkin: React.FC<TextMemoirSkinProps> = ({
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
              width: "100%",
              maxWidth: "360px",
              boxSizing: "border-box",
              position: "relative",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
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
