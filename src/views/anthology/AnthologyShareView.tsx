import { SharePage } from "@src/components/Layout/SharePage";

export const AnthologyShareView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <SharePage />

      {/* 
        <Toast/>
       */}
    </div>
  );
};
