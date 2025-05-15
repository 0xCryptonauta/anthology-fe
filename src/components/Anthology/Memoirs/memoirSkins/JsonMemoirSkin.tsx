import { MemoirInterface } from "@src/store/slices/anthologySlice";

export const JsonMemoirSkin = ({ memoirs }: { memoirs: MemoirInterface[] }) => {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        color: "#ffffff",
        padding: "10px",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: window.innerWidth < 768 ? "12px" : "14px", // Responsive font size
        lineHeight: "1.4",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <pre>
        <code>{JSON.stringify(memoirs, null, 2)}</code>
      </pre>
    </div>
  );
};
