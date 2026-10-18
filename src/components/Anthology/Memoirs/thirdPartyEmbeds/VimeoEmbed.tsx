import { useEffect, useState } from "react";
import { useEmbedPlayback } from "./embedPlayback";

export const VimeoEmbed = ({
  videoId,
  hash,
}: {
  videoId: string;
  hash?: string;
}) => {
  const { isActive, activate } = useEmbedPlayback();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchThumbnail = async () => {
      try {
        const response = await fetch(
          `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
            `https://vimeo.com/${videoId}`
          )}`
        );
        if (!response.ok) return;
        const text = await response.text();
        // Vimeo prefixes JSON with `while(1);` (anti-hijacking guard)
        const data = JSON.parse(text.replace(/^while\(1\);/, ""));
        if (!cancelled && typeof data.thumbnail_url === "string") {
          setThumbnailUrl(data.thumbnail_url);
        }
      } catch {
        // No poster available — keep the plain placeholder
      }
    };

    fetchThumbnail();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#1a1a2e",
        cursor: isActive ? "default" : "pointer",
      }}
      onClick={isActive ? undefined : activate}
    >
      {isActive ? (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}${
            hash ? `?h=${hash}&autoplay=1` : "?autoplay=1"
          }`}
          style={{ width: "100%", height: "100%", border: 0 }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="Vimeo video"
        />
      ) : (
        <>
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
                opacity: 0.75,
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "#1ab7ea",
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
        </>
      )}
    </div>
  );
};
