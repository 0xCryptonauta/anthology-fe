import { Seo } from "@components/Layout/Seo";

export const AboutView = () => {
  return (
    <>
      <Seo title="About" description="Learn more about the Anthology project" />
      <div
        style={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          padding: "2rem",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <span>Some description about this project</span>
      </div>
    </>
  );
};
