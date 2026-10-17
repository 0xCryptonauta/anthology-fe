import type { SpotifyContentType } from "@src/utils/embeds";

export const SpotifyEmbed = ({
  contentType,
  contentId,
}: {
  contentType: SpotifyContentType;
  contentId: string;
}) => (
  <iframe
    style={{ borderRadius: "12px" }}
    src={`https://open.spotify.com/embed/${contentType}/${contentId}?utm_source=generator`}
    width="100%"
    height="352"
    frameBorder="0"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  ></iframe>
);
