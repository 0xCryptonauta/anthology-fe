import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@components/Layout/Seo";
import { SocialEmbedsSettingsContent } from "@components/Layout/SocialEmbedsSettingsContent";
import {
  readingPageStyle,
  readingPanelStyle,
} from "@src/styles/readingPanelStyles";
import { useAppSelector } from "@src/store/utils/hooks";
import { getBgClass } from "@src/utils/backgrounds";
import "@src/styles/backgrounds.css";
import { useTranslation } from "@src/i18n/useTranslation";

export const PrivacyView = () => {
  const { t } = useTranslation();
  const categoryBackgroundsEnabled = useAppSelector(
    (state) => state.dapp.categoryBackgroundsEnabled
  );

  return (
    <>
      <Seo
        title={t("about.privacyTitle")}
        description="How Anthology handles local data, wallet connections and third-party social embeds"
      />
      <div style={readingPageStyle}>
        <div
          className={
            categoryBackgroundsEnabled
              ? `reading-panel-pattern ${getBgClass("privacy")}`
              : undefined
          }
          style={{
            ...readingPanelStyle,
            backgroundColor: categoryBackgroundsEnabled
              ? "transparent"
              : readingPanelStyle.backgroundColor,
          }}
        >
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

          <section
            aria-labelledby="privacy-rpc-heading"
            style={{ ...explainerSectionStyle, marginTop: "1.25rem" }}
          >
            <h2
              id="privacy-rpc-heading"
              style={{ ...sectionHeadingStyle, textAlign: "center" }}
            >
              {t("about.privacyRpcTitle")}
            </h2>
            <p style={paragraphStyle}>{t("about.privacyRpcIntro")}</p>
            <ul style={rpcListStyle}>
              <li style={rpcListItemStyle}>{t("about.privacyReadRpc")}</li>
              <li style={rpcListItemStyle}>{t("about.privacyRelayRpc")}</li>
              <li style={rpcListItemStyle}>{t("about.privacyWalletRpc")}</li>
            </ul>
            <p style={paragraphStyle}>{t("about.privacyWalletModal")}</p>
            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              {t("about.privacyRpcBoundary")}
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

const rpcListStyle: CSSProperties = {
  margin: "0 0 1rem",
  paddingLeft: "1.25rem",
  color: "#1a1a1a",
};

const rpcListItemStyle: CSSProperties = {
  fontSize: "0.95rem",
  lineHeight: 1.6,
  marginBottom: "0.5rem",
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: "1.05rem",
  fontWeight: 600,
  margin: "0 0 0.4rem",
  color: "#b45309",
};
