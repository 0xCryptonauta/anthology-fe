import { useInView } from "react-intersection-observer";
import "./YoutubeEmbed.css";
import { useEmbedPlayback } from "./embedPlayback";
import { useTranslation } from "@src/i18n/useTranslation";

type YoutubeEmbedProps = {
  videoId: string;
};

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ videoId }) => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });
  const { isActive, activate } = useEmbedPlayback();

  return (
    <div
      ref={ref}
      className="yt-embed-container"
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-label={isActive ? undefined : t("a11y.playVideo")}
      onClick={isActive ? undefined : activate}
      onKeyDown={
        isActive
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate();
              }
            }
      }
    >
      <div className="yt-embed-aspect">
        {inView ? (
          isActive ? (
            <iframe
              className="yt-embed-fill"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                className="yt-embed-fill yt-embed-thumbnail"
                src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
                alt="YouTube thumbnail"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="yt-embed-overlay">
                <div className="yt-embed-play-btn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          )
        ) : (
          <div className="yt-embed-skeleton">
            <div className="yt-embed-skeleton-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
