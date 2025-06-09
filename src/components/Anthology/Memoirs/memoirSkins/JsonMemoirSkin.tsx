import { MemoirInterface } from "@src/store/slices/anthologySlice";

export const JsonMemoirSkin = ({
  memoirs,
  orderedMemoirsIndexes,
}: {
  memoirs: MemoirInterface[];
  orderedMemoirsIndexes: number[];
}) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        maxHeight: "100%", // adjust as needed
        overflowY: "auto",
        color: "#ffffff",
        padding: "10px",
        borderRadius: "8px",
        whiteSpace: "pre-wrap", // enable wrapping and preserve line breaks
        wordBreak: "break-word", // break long words to avoid horizontal scroll
        fontSize: window.innerWidth < 768 ? "12px" : "14px",
        lineHeight: "1.4",
        boxSizing: "border-box",
        fontFamily: "monospace",
        margin: "10px",
      }}
    >
      <pre
        style={{
          margin: 0,
          whiteSpace: "inherit", // inherit pre-wrap to keep indentation + wrap
        }}
      >
        <code>
          {JSON.stringify(
            orderedMemoirsIndexes.map((i) => memoirs[i]),
            null,
            2
          )}
        </code>
      </pre>
    </div>
  );
};
