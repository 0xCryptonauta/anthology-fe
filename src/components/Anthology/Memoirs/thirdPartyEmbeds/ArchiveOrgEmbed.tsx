import { useState } from "react";
import { useEmbedPlayback } from "./embedPlayback";
import { useTranslation } from "@src/i18n/useTranslation";

export const ArchiveOrgEmbed = ({ itemId }: { itemId: string }) => {
  const { t } = useTranslation();
  const { isActive, activate } = useEmbedPlayback();
  const [posterFailed, setPosterFailed] = useState(false);

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
      {isActive ? (
        <iframe
          src={`https://archive.org/embed/${itemId}`}
          style={{ width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Internet Archive item"
        />
      ) : (
        <>
          {!posterFailed && (
            <img
              src={`https://archive.org/services/img/${itemId}`}
              alt=""
              onError={() => setPosterFailed(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.7,
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
                backgroundColor: "#334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
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
