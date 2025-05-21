import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { YOUTUBE_REGEX } from "@src/utils/regex";

export const PlaylistMemoirSkin = ({
  memoirs,
}: {
  memoirs: MemoirInterface[];
}) => {
  const extractYoutubeIds = (videoLinks: MemoirInterface[]) => {
    return videoLinks.map((vlink) => {
      const match = vlink.content.match(YOUTUBE_REGEX);
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
  );
};
