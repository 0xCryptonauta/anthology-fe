import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@components/Layout/Seo";
import { SocialEmbedsSettingsContent } from "@components/Layout/SocialEmbedsSettingsContent";
import {
  readingPageStyle,
  readingPanelStyle,
} from "@src/styles/readingPanelStyles";
import { useTranslation } from "@src/i18n/useTranslation";

export const PrivacyView = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo
        title={t("about.privacyTitle")}
        description="How Anthology handles local data, wallet connections and third-party social embeds"
      />
      <div style={readingPageStyle}>
        <div style={readingPanelStyle}>
          <h1 style={titleStyle}>{t("about.privacyTitle")}</h1>

          <section
            id="social-embeds"
            aria-labelledby="social-embeds-heading"
            style={socialSectionStyle}
          >
            <h2
              id="social-embeds-heading"
              style={{ ...sectionHeadingStyle, textAlign: "center" }}
            >
              {t("settings.socialEmbeds")}
            </h2>
            <p style={paragraphStyle}>{t("settings.socialEmbedsDesc")}</p>
            <div style={socialContentStyle}>
              <SocialEmbedsSettingsContent />
            </div>
          </section>

          <section
            aria-labelledby="privacy-explainer-heading"
            style={explainerSectionStyle}
          >
            <h2
              id="privacy-explainer-heading"
              style={{ ...sectionHeadingStyle, textAlign: "center" }}
            >
              {t("about.privacyExplainerTitle")}
            </h2>
            <p style={paragraphStyle}>{t("about.privacyIntro")}</p>
            <p style={paragraphStyle}>{t("about.privacyStorage")}</p>
            <p style={paragraphStyle}>{t("about.privacyWallet")}</p>
            <p style={paragraphStyle}>{t("about.privacyEmbeds")}</p>
            <p style={paragraphStyle}>{t("about.privacyHosting")}</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              {t("about.privacyControl")}
            </p>
          </section>

          <p style={{ ...paragraphStyle, margin: "1.5rem 0 0" }}>
            <Link to="/about" style={{ color: "#1a1a1a" }}>
              ← {t("nav.about")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

const titleStyle: CSSProperties = {
  fontSize: "1.8rem",
  margin: "0 0 1rem",
  textAlign: "center",
  color: "#1a1a1a",
};

const paragraphStyle: CSSProperties = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "#1a1a1a",
  marginBottom: "1rem",
};

const socialSectionStyle: CSSProperties = {
  marginBottom: "2rem",
};

const socialContentStyle: CSSProperties = {
  maxWidth: "420px",
  margin: "0 auto",
  textAlign: "center",
  color: "#1a1a1a",
};

const explainerSectionStyle: CSSProperties = {
  paddingTop: "1.25rem",
  borderTop: "1px solid rgba(26, 26, 26, 0.2)",
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 600,
  margin: "0 0 0.4rem",
  color: "#b45309",
};
