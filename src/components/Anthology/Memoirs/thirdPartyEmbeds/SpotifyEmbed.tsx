import { useEffect, useState } from "react";
import type { SpotifyContentType } from "@src/utils/embeds";
import { useEmbedPlayback } from "./embedPlayback";

export const SpotifyEmbed = ({
  contentType,
  contentId,
}: {
  contentType: SpotifyContentType;
  contentId: string;
}) => {
  const { isActive, activate } = useEmbedPlayback();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchThumbnail = async () => {
      try {
        const response = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(
            `https://open.spotify.com/${contentType}/${contentId}`
          )}`
        );
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && typeof data.thumbnail_url === "string") {
          setThumbnailUrl(data.thumbnail_url);
        }
      } catch {
        // No poster available — fall back to the plain placeholder
      }
    };

    fetchThumbnail();
    return () => {
      cancelled = true;
    };
  }, [contentType, contentId]);

  if (isActive) {
    return (
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
  }

  return (
    <div
      onClick={activate}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "152px",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#1a1a2e",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.65,
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: "#1DB954",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          style={{
            width: "22px",
            height: "22px",
            fill: "white",
            marginLeft: "3px",
          }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
};
