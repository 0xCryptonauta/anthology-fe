import { shortenAddress } from "@utils/shortenAddress";
import { AppDispatch } from "@store/redux";
import { formatUnixTime } from "@utils/formatUnixTime";
import { MemoirInterface } from "@store/slices/anthologySlice";
import { ToastVariantType, useToast } from "@components/Layout/Toast";
import { Address } from "@src/types/common";
import { isValidURL } from "@src/utils/isValidURL";
// Media memoir skins
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
  orderMap: number[];
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
  orderMap,
  currentUser,
  dispatch,
  handleDelete,
}) => {
  const { addToast } = useToast();

  return (
    <>
      {memoirs.map((memoir, index) => {
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
            // THIS RETURN is temporal -> Depends on  /s/ reddit links (no post id or username)
            return (
              <div style={{ overflowWrap: "break-word" }}>
                <a
                  href={memoir.content}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {memoir.content}
                </a>
              </div>
            );
          }
          if (facebookMatch) {
            console.log("facebookMatch:", facebookMatch);
            return <FacebookEmbed postUrl={memoir.content} />;
          }
          if (instagramMatch) {
            console.log("instagramMatch:", instagramMatch);
            return <InstagramEmbed postUrl={memoir.content} />;
          }
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
            <a href={memoir.content} target="_blank" rel="noopener noreferrer">
              {memoir.content}
            </a>
          ) : (
            <p>{memoir.content}</p>
          );
        };

        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "360px",
              padding: "5px",
              borderRadius: "7px",
              margin: "15px 5px",
              position: "relative",
              order: orderMap.indexOf(index),
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "350px",
                overflowWrap: "break-word",
              }}
            >
              <b>{memoir.title}</b>
            </div>

            <div
              style={{
                textAlign: "center",
                maxWidth: "350px",
                padding: "5px",
                margin: "0 5px",
                overflowWrap: "break-word",
              }}
            >
              {renderContent()}
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "0 40px",
                }}
              >
                <span
                  style={{ fontSize: "12px", cursor: "pointer" }}
                  onClick={() =>
                    dispatch(updateCurrentPath(`user/${memoir.sender}`))
                  }
                >
                  {shortenAddress(memoir.sender, 10, 8)}
                </span>
                <span style={{ fontSize: "12px", marginLeft: "7px" }}>
                  {formatUnixTime(Number(memoir.timestamp))}
                </span>
              </div>

              {(currentUser === anthologyOwner ||
                anthologyOwner === LOCAL_USER_ADDR ||
                currentUser === memoir.sender) && (
                <span
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    bottom: "5px",
                  }}
                  onClick={() => {
                    handleDelete({ contractAddr, index, dispatch, addToast });
                  }}
                >
                  ❌
                </span>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
