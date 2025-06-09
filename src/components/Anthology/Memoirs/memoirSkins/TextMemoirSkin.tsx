import { shortenAddress } from "@utils/shortenAddress";
import { AppDispatch } from "@store/redux";
import { formatUnixTime } from "@utils/formatUnixTime";
import { MemoirInterface } from "@store/slices/anthologySlice";
import { ToastVariantType, useToast } from "@components/Layout/Toast";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";

interface TextMemoirSkinProps {
  contractAddr: `0x${string}`;
  currentUser: `0x${string}` | "";
  anthologyOwner: `0x${string}`;
  memoirs: MemoirInterface[];
  orderedMemoirsIndexes: number[];
  dispatch: AppDispatch;
  handleDelete: (object: HandleDeleteProps) => void;
}

interface CustomToastProps {
  id: string;
  title: string;
  content: string;
  delay?: number;
  variant: ToastVariantType;
}

interface HandleDeleteProps {
  contractAddr: Address;
  index: number;
  dispatch: AppDispatch;
  addToast: (toast: Omit<CustomToastProps, "id">) => void;
}

export const TextMemoirSkin: React.FC<TextMemoirSkinProps> = ({
  contractAddr,
  anthologyOwner,
  memoirs,
  orderedMemoirsIndexes,
  currentUser,
  dispatch,
  handleDelete,
}) => {
  const { addToast } = useToast();

  if (!memoirs?.length) {
    return (
      <div style={{ margin: "2rem", textAlign: "center" }}>
        No memoirs found.
      </div>
    );
  }

  return (
    <>
      {orderedMemoirsIndexes.map((i) => {
        const memoir = memoirs[i];

        const isDeletable =
          currentUser === anthologyOwner ||
          anthologyOwner === LOCAL_USER_ADDR ||
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
              margin: "15px 0px",
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
                  handleDelete({ contractAddr, index: i, dispatch, addToast })
                }
              >
                ❌
              </span>
            )}
          </div>
        );
      })}
    </>
  );
};
