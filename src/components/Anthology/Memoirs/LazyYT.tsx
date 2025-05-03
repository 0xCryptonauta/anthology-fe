import React, { useState } from "react";
import { useInView } from "react-intersection-observer";

type LazyYTProps = {
  videoId: string;
};

export const LazyYT: React.FC<LazyYTProps> = ({ videoId }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [isPlayerActive, setIsPlayerActive] = useState(false);

  const width = 350;
  const height = 197; // 16:9 aspect ratio

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => setIsPlayerActive(true)}
    >
      {inView ? (
        isPlayerActive ? (
          <iframe
            width={width}
            height={height}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          />
        ) : (
          <>
            <picture>
              <source
                srcSet={`https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`}
                type="image/webp"
              />
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="YouTube thumbnail"
                width={width}
                height={height}
                style={{ display: "block", objectFit: "cover" }}
              />
            </picture>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </>
        )
      ) : (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};
