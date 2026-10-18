import { Seo } from "@components/Layout/Seo";
import { useTranslation } from "@src/i18n/useTranslation";

const headingStyle = {
  fontSize: "1.05rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  marginTop: "1.5rem",
  color: "#b45309",
};

const paragraphStyle = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "#1a1a1a",
  marginBottom: "1rem",
};

const subHeadingStyle = {
  fontSize: "0.95rem",
  fontWeight: 600,
  marginBottom: "0.3rem",
  marginTop: "1.25rem",
  color: "#1a1a1a",
};

const quoteStyle = {
  fontSize: "0.95rem",
  fontStyle: "italic",
  color: "#333",
  margin: "0 0 0.35rem 0",
  paddingLeft: "1rem",
  borderLeft: "3px solid #b45309",
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

          {/* ----------------------------- Why memory? ----------------------------- */}
          <h2 style={headingStyle}>{t("about.whyTitle")}</h2>
          <p style={paragraphStyle}>{t("about.whyIntro")}</p>
          <p style={paragraphStyle}>{t("about.whyPerson")}</p>
          <p style={paragraphStyle}>{t("about.whyForget")}</p>
          <p style={paragraphStyle}>{t("about.whyFilter")}</p>
          <p style={quoteStyle}>{t("about.whyFilter1")}</p>
          <p style={quoteStyle}>{t("about.whyFilter2")}</p>
          <p style={quoteStyle}>{t("about.whyFilter3")}</p>

          <h3 style={subHeadingStyle}>{t("about.whyIdeasTitle")}</h3>
          <p style={paragraphStyle}>
            <strong>{t("about.whyIdeas1Title")}.</strong>{" "}
            {t("about.whyIdeas1")}
          </p>
          <p style={paragraphStyle}>
            <strong>{t("about.whyIdeas2Title")}.</strong>{" "}
            {t("about.whyIdeas2")}
          </p>
          <p style={paragraphStyle}>
            <strong>{t("about.whyIdeas3Title")}.</strong>{" "}
            {t("about.whyIdeas3")}
          </p>

          {/* ------------------------------ Glossary ------------------------------- */}
          <h2 style={headingStyle}>{t("about.glossaryTitle")}</h2>
          <p style={paragraphStyle}>
            <strong>{t("about.glossaryMemoir")}:</strong>{" "}
            {t("about.glossaryMemoirDesc")}
          </p>
          <p style={paragraphStyle}>
            <strong>{t("about.glossaryAnthology")}:</strong>{" "}
            {t("about.glossaryAnthologyDesc")}
          </p>
          <p style={paragraphStyle}>
            <strong>{t("about.glossaryMemory")}:</strong>{" "}
            {t("about.glossaryMemoryDesc")}
          </p>

          {/* --------------------------- 100% static ------------------------------- */}
          <h2 style={headingStyle}>{t("about.staticTitle")}</h2>
          <p style={paragraphStyle}>{t("about.staticNoBackend")}</p>
          <p style={paragraphStyle}>{t("about.staticLocal")}</p>
          <p style={paragraphStyle}>{t("about.staticChain")}</p>
          <p style={paragraphStyle}>{t("about.staticCleanLinks")}</p>

          {/* -------------------- Wallets & smart contracts ------------------------ */}
          <h2 style={headingStyle}>{t("about.walletTitle")}</h2>
          <p style={paragraphStyle}>{t("about.walletIdentity")}</p>
          <p style={paragraphStyle}>{t("about.walletContracts")}</p>

          {/* ---------------------- The two smart contracts ------------------------ */}
          <h2 style={headingStyle}>{t("about.contractsTitle")}</h2>
          <h3 style={subHeadingStyle}>{t("about.factoryTitle")}</h3>
          <p style={paragraphStyle}>{t("about.factoryDesc")}</p>
          <h3 style={subHeadingStyle}>{t("about.anthologyTitle")}</h3>
          <p style={{ ...paragraphStyle, marginBottom: 0 }}>
            {t("about.anthologyDesc")}
          </p>
        </div>
      </div>
    </>
  );
};
