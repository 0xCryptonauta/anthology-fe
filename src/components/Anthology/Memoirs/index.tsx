import { useDispatch, useSelector } from "react-redux";
import { shortenAddress } from "../../../utils/shortenAddress";
import { AppDispatch, RootState } from "../../../store";
import { writeAnthology } from "../../../contract-functions/AnthologyFunctions";
import { removeOneFromMemoirs } from "../../../slices/anthologySlice";
import { formatUnixTime } from "../../../utils/formatUnixTime";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SkinType } from "../../../slices/anthologySlice";
import { MemoirInterface } from "../../../slices/anthologySlice";
import { OrderType } from "../../OrderSelector";
import { ToastVariantType, useToast } from "../../Toast";
// Media memoir skins
import { TwitterEmbed } from "./TwitterEmbed";
import { LazyYT } from "./LazyYT";
import RedditEmbed from "./RedditEmbed";
import FacebookEmbed from "./facebookEmbed";
import InstagramEmbed from "./InstagramEmbed";

const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*?v=)?|embed\/|shorts\/)|youtu\.be\/)(.{11})$/i;

const spotifyRegex =
  /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]{22})/i;

const twitterRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([\w]+)\/status\/(\d+)/i;

const redditRegex =
  /^(?:https?:\/\/)?(?:www\.)?reddit\.com\/r\/([\w]+)\/(?:comments\/([\w]+)\/?([\w%-]*)|s\/[\w]+)\/?$/i;

const instagramRegex =
  /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/((p|reel|tv)\/[\w-]+\/?|[\w.-]+\/?)$/i;

const facebookRegex =
  /^(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com\/(?:\w+\/(?:posts|videos)\/(\d+)|watch\?v=(\d+))/i;

const isValidURL = (str: string) => {
  const regex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w _-]*(?:[/\w _-]*\?[^\s]*)?)?\/?$/;
  return regex.test(str);
};

const handleDelete = async ({
  contractAddr,
  index,
  dispatch,
  addToast,
}: {
  contractAddr: string;
  index: number;
  dispatch: AppDispatch;
  addToast: ({
    title,
    content,
    variant,
  }: {
    title: string;
    content: string;
    variant: ToastVariantType;
  }) => void;
}) => {
  try {
    const txHash = await writeAnthology(contractAddr, "deleteMemoir", [index]);
    console.log("Deleting TxHash:", txHash);
    dispatch(
      removeOneFromMemoirs({
        contract: contractAddr,
        memoirIndex: index,
      })
    );
    if (txHash) {
      addToast({
        title: "Memoir deleted",
        content: "TxHash: " + txHash,
        variant: "danger",
      });
    }
  } catch (error) {
    console.error("Error deleting memoir:", error);
    addToast({
      title: "Error deleting memoir",
      content: "Error deleting memoir",
      variant: "danger",
    });
  }
};

const RenderMediaMemoirs = ({
  contractAddr,
  anthologyOwner,
  memoirs,
  orderMap,
  currentUser,
  dispatch,
  navigate,
}: {
  contractAddr: string;
  currentUser: string;
  anthologyOwner: string;
  memoirs: MemoirInterface[];
  orderMap: number[];
  dispatch: AppDispatch;
  navigate: NavigateFunction;
}) => {
  const { addToast } = useToast();

  return (
    <>
      {memoirs.map((memoir, index) => {
        const youtubeMatch = youtubeRegex.exec(memoir.content);
        const spotifyMatch = spotifyRegex.exec(memoir.content);
        const twitterMatch = twitterRegex.exec(memoir.content);
        const redditMatch = redditRegex.exec(memoir.content);
        const facebookMatch = facebookRegex.exec(memoir.content);
        const instagramMatch = instagramRegex.exec(memoir.content);

        const renderContent = () => {
          if (youtubeMatch) return <LazyYT videoId={youtubeMatch[1]} />;
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
                  onClick={() => navigate(`/${memoir.sender}`)}
                >
                  {shortenAddress(memoir.sender, 10, 8)}
                </span>
                <span style={{ fontSize: "12px", marginLeft: "7px" }}>
                  {formatUnixTime(Number(memoir.timestamp))}
                </span>
              </div>

              {(currentUser === anthologyOwner ||
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

const RenderJsonMemoirs = ({ memoirs }: { memoirs: MemoirInterface[] }) => {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        color: "#ffffff",
        padding: "10px",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: window.innerWidth < 768 ? "12px" : "14px", // Responsive font size
        lineHeight: "1.4",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <pre>
        <code>{JSON.stringify(memoirs, null, 2)}</code>
      </pre>
    </div>
  );
};

const RenderTextMemoirs = ({
  contractAddr,
  anthologyOwner,
  memoirs,
  currentUser,
  dispatch,
  navigate,
}: {
  contractAddr: string;
  currentUser: string;
  anthologyOwner: string;
  memoirs: MemoirInterface[];
  dispatch: AppDispatch;
  navigate: NavigateFunction;
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
                onClick={() => navigate("/" + memoir.sender)}
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

const RenderListMemoirs = ({ memoirs }: { memoirs: MemoirInterface[] }) => {
  return (
    <div style={{ marginTop: "30px" }}>
      {memoirs.map((memoir, index) => {
        return (
          <div key={index}>
            <span>
              {index} - {memoir.title}
            </span>
            <p>{memoir.content}</p>
          </div>
        );
      })}
    </div>
  );
};

const RenderPlaylistMemoirs = ({ memoirs }: { memoirs: MemoirInterface[] }) => {
  const extractYoutubeIds = (videoLinks: MemoirInterface[]) => {
    return videoLinks.map((vlink) => {
      const match = vlink.content.match(youtubeRegex);
      return match && match[1] ? match[1] : "";
    });
  };

  const youtubeIds = extractYoutubeIds(memoirs);
  const nonEmptyYoutubeIds = youtubeIds.filter((str) => str !== "");

  const playlistUrl = `https://www.youtube.com/embed/${
    nonEmptyYoutubeIds[0]
  }?playlist=${nonEmptyYoutubeIds.slice(1).join(",")}`;

  return (
    <div
      style={{
        width: "100vw",
        aspectRatio: "16/9",
        maxHeight: "75vh",
        margin: "10px",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={playlistUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const RenderMemoirs = ({
  anthologySkin,
  order,
  anthologyOwner,
  memoirs,
  contractAddr,
  currentUser,
  dispatch,
  navigate,
}: {
  anthologySkin: SkinType;
  order: OrderType;
  anthologyOwner: string;
  memoirs: MemoirInterface[];
  contractAddr: string;
  currentUser: string;
  dispatch: AppDispatch;
  navigate: NavigateFunction;
}) => {
  const orderedMemoirs = orderMemoirs({
    memoirs,
    order,
  });

  try {
    switch (anthologySkin) {
      case "json":
        return RenderJsonMemoirs({ memoirs });
      case "media":
        return RenderMediaMemoirs({
          contractAddr,
          anthologyOwner,
          memoirs,
          currentUser,
          orderMap: orderedMemoirs.map((_, i) => i), //Not working -> iframe refetching
          dispatch,
          navigate,
        });
      case "text":
        return RenderTextMemoirs({
          contractAddr,
          anthologyOwner,
          memoirs: orderedMemoirs,
          currentUser,
          dispatch,
          navigate,
        });
      case "list":
        return RenderListMemoirs({
          memoirs: orderedMemoirs,
        });

      case "playlist":
        return RenderPlaylistMemoirs({
          memoirs: orderedMemoirs,
        });
      default:
        return RenderTextMemoirs({
          contractAddr,
          anthologyOwner,
          memoirs: orderedMemoirs,
          currentUser,
          dispatch,
          navigate,
        });
      //throw new Error(`Unsupported skin type: ${memoirSkin}`);
    }
  } catch (error) {
    console.error("Error rendering RenderMemoirs:", error);
    return <div>Error rendering RenderMemoirs</div>;
  }
};

const orderMemoirs = ({
  memoirs,
  order,
}: {
  memoirs: MemoirInterface[];
  order: OrderType;
}) => {
  try {
    switch (order) {
      case "Newer":
        return memoirs.sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );
      case "Older":
        return memoirs.sort(
          (a, b) => Number(a.timestamp) - Number(b.timestamp)
        );
      case "A -> Z":
        return memoirs.sort((a, b) => a.title.localeCompare(b.title));
      case "Z -> A":
        return memoirs.sort((a, b) => b.title.localeCompare(a.title));
      default:
        throw new Error(`Unsupported skin type: ${order}`);
        return memoirs;
    }
  } catch (error) {
    console.error("Error ordering memoirs:", error);
    return memoirs;
  }
};

export const Memoirs = ({
  contractAddr,
  skin,
  order,
}: {
  contractAddr: string;
  skin: SkinType;
  order: OrderType;
}) => {
  const anthology = useSelector((state: RootState) =>
    contractAddr ? state.anthology[contractAddr] : undefined
  );
  const { userAddr } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      style={{
        //border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "relative",
      }}
    >
      {anthology &&
        RenderMemoirs({
          anthologySkin: skin,
          order,
          contractAddr,
          anthologyOwner: anthology.anthologyState.owner,
          memoirs: anthology.memoirs,
          currentUser: userAddr,
          dispatch,
          navigate,
        })}
    </div>
  );
};
