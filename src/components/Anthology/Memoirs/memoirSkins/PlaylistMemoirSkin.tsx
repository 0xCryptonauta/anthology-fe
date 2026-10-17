import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { extractEmbed } from "@src/utils/embeds";
import { ListMemoirSkin } from "./ListMemoirSkin";
import { useOrderedMemoirs } from "@src/hooks/useOrderedMemoirs";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { Address } from "@src/types/common";

export const PlaylistMemoirSkin = ({
  anthologyAddr,
  order,
  search,
}: {
  anthologyAddr: Address;
  order: OrderType;
  search?: string;
}) => {
  const { memoirs, orderedMemoirsIndexes } = useOrderedMemoirs(
    anthologyAddr,
    order,
    search
  );

  const extractYoutubeIds = (videoLinks: MemoirInterface[]) => {
    return videoLinks.map((vlink) => {
      const extracted = extractEmbed(vlink.content);
      return extracted?.embed.provider === "youtube"
        ? extracted.embed.videoId
        : "";
    });
  };

  const orderedMemoirs = orderedMemoirsIndexes.map((i) => memoirs[i]);

  const youtubeIds = extractYoutubeIds(orderedMemoirs);
  const nonEmptyYoutubeIds = youtubeIds.filter((str) => str !== "");

  const playlistUrl = `https://www.youtube.com/embed/?playlist=${nonEmptyYoutubeIds.join(
    ","
  )}`;

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
    <div style={{ marginTop: "30px" }}>
      <div style={{ display: "flex", justifyContent: "center", color: "red" }}>
        Youtube videos not found
      </div>
      <ListMemoirSkin anthologyAddr={anthologyAddr} order={order} />
    </div>
  );
};
