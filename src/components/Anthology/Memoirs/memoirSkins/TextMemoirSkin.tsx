import { shortenAddress } from "@utils/shortenAddress";
import { AppDispatch } from "@store/redux";
import { formatUnixTime } from "@utils/formatUnixTime";
import { MemoirInterface } from "@store/slices/anthologySlice";

import { ToastVariantType, useToast } from "@components/Layout/Toast";
// Media memoir skins
/* import { TwitterEmbed } from "./thirdPartyEmbeds/TwitterEmbed";
import { LazyYT } from "./thirdPartyEmbeds/LazyYT";
import RedditEmbed from "./thirdPartyEmbeds/RedditEmbed";
import FacebookEmbed from "./thirdPartyEmbeds/facebookEmbed";
import InstagramEmbed from "./thirdPartyEmbeds/InstagramEmbed"; */
import { ActiveView, Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";

interface TextMemoirSkinProps {
  contractAddr: `0x${string}`;
  currentUser: `0x${string}` | "";
  anthologyOwner: `0x${string}`;
  memoirs: MemoirInterface[];
  dispatch: AppDispatch;
  setActiveView: (newActiveView: ActiveView) => void;
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
  currentUser,
  dispatch,
  setActiveView,
  handleDelete,
}) => {
  const { addToast } = useToast();

  try {
    return memoirs.map((memoir: MemoirInterface, index: number) => {
      return (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid white",
            width: "360px",
            padding: "5px",
            borderRadius: "7px",
            margin: "15px 5px",
            position: "relative",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "350px",
              overflowWrap: "break-word",
            }}
          >
            <span style={{ marginTop: "5px" }}>
              <b>{memoir.title}</b>
            </span>
          </div>
          <br />
          <div
            style={{
              textAlign: "center",
              maxWidth: "350px",
              overflowWrap: "break-word",
              padding: "5px",
              margin: "0px 5px",
            }}
          >
            {isValidURL(memoir.content) ? (
              <a
                href={memoir.content}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                {memoir.content}
              </a>
            ) : (
              <span>{memoir.content}</span>
            )}
          </div>
          <br />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignItems: "center",
              margin: "0px 40px",
            }}
          >
            <div>
              <span
                style={{ fontSize: "12px", cursor: "pointer" }}
                onClick={() => setActiveView(`user/${memoir.sender}`)}
              >
                {shortenAddress(memoir.sender, 10, 8)}
              </span>
            </div>

            <div style={{ fontSize: "12px", marginLeft: "7px" }}>
              <span>{formatUnixTime(Number(memoir.timestamp))}</span>
            </div>
          </div>
          {(currentUser == anthologyOwner || currentUser == memoir.sender) && (
            <span
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "10px",
                bottom: "5px",
              }}
              onClick={() =>
                handleDelete({ contractAddr, index, dispatch, addToast })
              }
            >
              ❌
            </span>
          )}
        </div>
      );
    });
  } catch (error) {
    console.error("Error rendering RenderMemoirsMedia:", error);
    return <div>Error rendering RenderMemoirsMedia</div>;
  }
};
