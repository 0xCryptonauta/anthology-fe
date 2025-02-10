import { useDispatch, useSelector } from "react-redux";
import { shortenAddress } from "../../functions/shortenAddress";
import { RootState } from "../../store";
import { writeAnthology } from "../ContractFunctions/AnthologyFunctions";
import { removeOneFromMemoirs } from "../../slices/anthologySlice";
import { formatUnixTime } from "../../functions/formatUnixTime";
import { useNavigate } from "react-router-dom";
import { LazyYT } from "../LazyYT";

const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*?v=)?|embed\/|shorts\/)|youtu\.be\/)(.{11})$/i;

const spotifyRegex =
  /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]{22})(?:\?.*)?$/i;

const isValidURL = (str: string) => {
  const regex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return regex.test(str);
};

export const Memoirs = ({ contractAddr }: { contractAddr: string }) => {
  const navigate = useNavigate();
  const anthology = useSelector((state: RootState) =>
    contractAddr ? state.anthology : undefined
  );
  const { userAddr } = useSelector((state: RootState) => state.user);

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
        anthology[contractAddr]?.memoirs.map((memoir, index) => {
          const youtubeMatch = youtubeRegex.exec(memoir.content);
          const spotifyMatch = spotifyRegex.exec(memoir.content);

          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                //border: "1px solid white",
                maxWidth: "360px",
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
                {!(youtubeMatch || spotifyMatch) && (
                  <p
                    style={{
                      padding: "5px",
                      margin: "0px 5px",
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
                      memoir.content
                    )}
                  </p>
                )}
                {youtubeMatch && (
                  <div>
                    <LazyYT videoId={youtubeMatch[1]} />
                  </div>
                )}

                {spotifyMatch && (
                  <div>
                    <iframe
                      style={{ borderRadius: "12px" }}
                      src={
                        "https://open.spotify.com/embed/" +
                        spotifyMatch[1] +
                        "/" +
                        spotifyMatch[2] +
                        "?utm_source=generator"
                      }
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen={false}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
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
              {(userAddr == anthology[contractAddr].anthologyState.owner ||
                userAddr == memoir.sender) && (
                <span
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "10px",
                    bottom: "5px",
                  }}
                  onClick={async () => {
                    const txHash = await writeAnthology(
                      contractAddr,
                      "deleteMemoir",
                      [index]
                    );
                    console.log("Hash:", txHash);
                    dispatch(
                      removeOneFromMemoirs({
                        contract: contractAddr,
                        memoirIndex: index,
                      })
                    );
                  }}
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
