import { MemoirInterface } from "@src/store/slices/anthologySlice";

interface ListMemoirSkinProps {
  memoirs: MemoirInterface[];
  orderedMemoirsIndexes: number[];
}

export const ListMemoirSkin: React.FC<ListMemoirSkinProps> = ({
  memoirs,
  orderedMemoirsIndexes,
}) => {
  if (!memoirs || memoirs.length === 0) {
    return <p style={{ margin: "30px" }}>No memoirs available.</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {orderedMemoirsIndexes.map((i, index) => {
        const { title, content } = memoirs[i];
        return (
          <div
            key={i}
            style={{
              width: "100%",
              minWidth: "300px",
              maxWidth: "600px",
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: "#333",
                display: "block",
                marginBottom: "0.25rem",
                wordBreak: "break-word",
              }}
            >
              {index + 1}. {title || "Untitled"}
            </span>
            <p
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                color: "#555",
                fontSize: "0.9rem",
                wordBreak: "break-word",
              }}
            >
              {content}
            </p>
          </div>
        );
      })}
    </div>
  );
};
