import { useEmbedPlayback } from "./embedPlayback";

export const ArchiveOrgEmbed = ({ itemId }: { itemId: string }) => {
  const { isActive, activate } = useEmbedPlayback();

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
          src={`https://archive.org/embed/${itemId}`}
          style={{ width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Internet Archive item"
        />
      ) : (
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
      )}
    </div>
  );
};
