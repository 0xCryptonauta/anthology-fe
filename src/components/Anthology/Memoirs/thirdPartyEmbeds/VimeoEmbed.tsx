export const VimeoEmbed = ({
  videoId,
  hash,
}: {
  videoId: string;
  hash?: string;
}) => (
  <div style={{ width: "100%", aspectRatio: "16/9" }}>
    <iframe
      src={`https://player.vimeo.com/video/${videoId}${
        hash ? `?h=${hash}` : ""
      }`}
      style={{ width: "100%", height: "100%", border: 0 }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      title="Vimeo video"
    />
  </div>
);
