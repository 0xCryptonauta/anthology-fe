import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { YOUTUBE_REGEX } from "@src/utils/regex";
import { ListMemoirSkin } from "./ListMemoirSkin";

export const PlaylistMemoirSkin = ({
  memoirs,
  orderedMemoirsIndexes,
}: {
  memoirs: MemoirInterface[];
  orderedMemoirsIndexes: number[];
}) => {
  const extractYoutubeIds = (videoLinks: MemoirInterface[]) => {
    return videoLinks.map((vlink) => {
      const match = vlink.content.match(YOUTUBE_REGEX);
      return match && match[1] ? match[1] : "";
    });
  };

  const orderedMemoirs = orderedMemoirsIndexes.map((i) => memoirs[i]);

  const youtubeIds = extractYoutubeIds(orderedMemoirs);
  const nonEmptyYoutubeIds = youtubeIds.filter((str) => str !== "");

  const playlistUrl = `https://www.youtube.com/embed/?playlist=${nonEmptyYoutubeIds.join(
    ","
  )}`;

  console.log("playlist:", nonEmptyYoutubeIds);

  return nonEmptyYoutubeIds.length > 0 ? (
    <div
      style={{
        width: "90vw",
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
  ) : (
    <div style={{ margin: "30px" }}>
      <div style={{ display: "flex", justifyContent: "center", color: "red" }}>
        Youtube videos not found
      </div>
      <ListMemoirSkin
        memoirs={memoirs}
        orderedMemoirsIndexes={orderedMemoirsIndexes}
      />
    </div>
  );
};
