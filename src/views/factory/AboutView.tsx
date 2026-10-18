import { Seo } from "@components/Layout/Seo";
import { useTranslation } from "@src/i18n/useTranslation";

const headingStyle = {
  fontSize: "1.05rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  color: "#b45309",
};

const paragraphStyle = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "#1a1a1a",
  marginBottom: "1.5rem",
};

export const AboutView = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t("nav.about")} description="Learn more about the Anthology project" />
      <div
        style={{
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
        <div
          style={{
            maxWidth: "640px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(6px)",
            borderRadius: "12px",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              marginBottom: "1.5rem",
              textAlign: "center",
              color: "#1a1a1a",
            }}
          >
            Anthology
          </h1>

          <p style={paragraphStyle}>{t("about.intro")}</p>

          <h2 style={headingStyle}>{t("about.localTitle")}</h2>
          <p style={paragraphStyle}>{t("about.local")}</p>

          <h2 style={headingStyle}>{t("about.permanentTitle")}</h2>
          <p style={paragraphStyle}>{t("about.permanent")}</p>

          <h2 style={headingStyle}>{t("about.shareTitle")}</h2>
          <p style={paragraphStyle}>{t("about.share")}</p>

          <h2 style={headingStyle}>{t("about.whyTitle")}</h2>
          <p style={{ ...paragraphStyle, marginBottom: 0 }}>
            {t("about.why")}
          </p>
        </div>
      </div>
    </>
  );
};
