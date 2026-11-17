import { SharePage } from "@src/components/Layout/SharePage";
import { Seo } from "@components/Layout/Seo";

export const AnthologyShareView = () => {
  return (
    <>
      <Seo title="Shared Anthology" description="Check out this anthology on Anthology" />
      <div
        style={{
          color: "white",
          minHeight: "100dvh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px 16px",
          boxSizing: "border-box",
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
