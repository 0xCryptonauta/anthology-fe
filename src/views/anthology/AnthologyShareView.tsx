import { SharePage } from "@src/components/Layout/SharePage";
import { Seo } from "@components/Layout/Seo";

export const AnthologyShareView = () => {
  return (
    <>
      <Seo title="Shared Anthology" description="Check out this anthology on Anthology" />
      <div
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
    </>
  );
};
