import { shortenAddress } from "@utils/shortenAddress";
import { AppDispatch } from "@store/redux";
import { formatUnixTime } from "@utils/formatUnixTime";
import { MemoirInterface } from "@store/slices/anthologySlice";
import { ToastVariantType, useToast } from "@components/Layout/Toast";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
import {
  TwitterEmbed,
  YoutubeEmbed,
  InstagramEmbed,
  FacebookEmbed,
  RedditEmbed,
} from "../thirdPartyEmbeds";
import {
  FACEBOOK_REGEX,
  INSTAGRAM_REGEX,
  REDDIT_REGEX,
  SPOTIFY_REGEX,
  TWITTER_REGEX,
  YOUTUBE_REGEX,
} from "@src/utils/regex";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";

interface MediaMemoirSkinProps {
  contractAddr: `0x${string}`;
  currentUser: `0x${string}` | "";
  anthologyOwner: `0x${string}`;
  memoirs: MemoirInterface[];
  orderedMemoirsIndexes: number[]; // renamed from orderMap for clarity
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

export const MediaMemoirSkin: React.FC<MediaMemoirSkinProps> = ({
  contractAddr,
  anthologyOwner,
  memoirs,
  orderedMemoirsIndexes,
  currentUser,
  dispatch,
  handleDelete,
}) => {
  const { addToast } = useToast();

  return (
    <div
      style={{
        padding: "20px 16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around",
        color: "black",
      }}
    >
      {orderedMemoirsIndexes.map((i) => {
        const memoir = memoirs[i];

        const youtubeMatch = YOUTUBE_REGEX.exec(memoir.content);
        const spotifyMatch = SPOTIFY_REGEX.exec(memoir.content);
        const twitterMatch = TWITTER_REGEX.exec(memoir.content);
        const redditMatch = REDDIT_REGEX.exec(memoir.content);
        const facebookMatch = FACEBOOK_REGEX.exec(memoir.content);
        const instagramMatch = INSTAGRAM_REGEX.exec(memoir.content);

        const renderContent = () => {
          if (youtubeMatch) return <YoutubeEmbed videoId={youtubeMatch[1]} />;
          if (twitterMatch)
            return (
              <TwitterEmbed
                username={twitterMatch[1]}
                postId={twitterMatch[2]}
              />
            );
          if (redditMatch) {
            if (redditMatch[2]) return <RedditEmbed postUrl={memoir.content} />;
            return (
              <div style={{ overflowWrap: "break-word" }}>
                <a
                  href={memoir.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  //style={{ color: "#666" }}
                >
                  {memoir.content}
                </a>
              </div>
            );
          }
          if (facebookMatch) return <FacebookEmbed postUrl={memoir.content} />;
          if (instagramMatch)
            return <InstagramEmbed postUrl={memoir.content} />;

          if (spotifyMatch)
            return (
              <iframe
                style={{ borderRadius: "12px" }}
                src={`https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
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
            <p>{memoir.content}</p>
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

            {(currentUser === anthologyOwner ||
              anthologyOwner === LOCAL_USER_ADDR ||
              currentUser === memoir.sender) && (
              <span
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  bottom: "10px",
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
    </div>
  );
};
