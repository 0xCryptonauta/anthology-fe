import { useEffect, useState } from "react";
import type { SpotifyContentType } from "@src/utils/embeds";
import { subscribeEmbedPlayback } from "./embedPlayback";

export const SpotifyEmbed = ({
  contentType,
  contentId,
}: {
  contentType: SpotifyContentType;
  contentId: string;
}) => {
  const [playbackKey, setPlaybackKey] = useState(0);

  useEffect(() => {
    // When another embed starts playing, remount the player to stop audio
    return subscribeEmbedPlayback((activeId) => {
      if (activeId) setPlaybackKey((key) => key + 1);
    });
  }, []);

  return (
    <iframe
      key={playbackKey}
      style={{ borderRadius: "12px" }}
      src={`https://open.spotify.com/embed/${contentType}/${contentId}?utm_source=generator`}
      width="100%"
      height="352"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
};
