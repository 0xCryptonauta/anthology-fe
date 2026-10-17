import { isValidURL } from "@src/utils/isValidURL";
import { extractEmbed } from "@src/utils/embeds";
import { EmbedRenderer } from "../thirdPartyEmbeds";
import { MemoirInterface } from "@src/store/slices/anthologySlice";

interface MediaSkinProps {
  memoir: MemoirInterface;
}

export const Mediaskin: React.FC<MediaSkinProps> = ({ memoir }) => {
  const extracted = extractEmbed(memoir.content);

  const renderContent = () => {
    if (extracted)
      return (
        <>
          <EmbedRenderer embed={extracted.embed} />
          {extracted.caption && (
            <div style={{ marginTop: "0.5rem", overflowWrap: "break-word" }}>
              {extracted.caption}
            </div>
          )}
        </>
      );

    return isValidURL(memoir.content) ? (
      <a
        href={memoir.content}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#666" }}
      >
        {memoir.content}
      </a>
    ) : (
      <span>{memoir.content}</span>
    );
  };

  const renderedContent = renderContent();

  return (
    <div
      style={{
        minWidth: "290px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "space-around",
        color: "black",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          //margin: "15px 0px",
          //borderRadius: "8px",
          //backgroundColor: "#f9f9f9",
          //boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            textAlign: "center",
            wordBreak: "break-word",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#333",
          }}
        >
          {memoir.title || "Untitled"}
        </div>

        <div
          style={{
            textAlign: "center",
            wordBreak: "break-word",
            minHeight: "100px",
          }}
        >
          {renderedContent}
        </div>
      </div>
    </div>
  );
};
