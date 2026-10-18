import { useState, useRef, useEffect, useCallback } from "react";
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
  const { t, locale } = useTranslation();
  const [showFull, setShowFull] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(1400);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const syncIframeHeight = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const h = Math.max(
      doc.body?.scrollHeight || 0,
      doc.documentElement?.scrollHeight || 0
    );
    if (h > 0) setIframeHeight(h + 16);
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleIframeLoad = () => {
    observerRef.current?.disconnect();
    syncIframeHeight();
    const doc = iframeRef.current?.contentDocument;
    if (doc?.documentElement && typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => syncIframeHeight());
      ro.observe(doc.documentElement);
      if (doc.body) ro.observe(doc.body);
      observerRef.current = ro;
    }
  };

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
          padding: "2rem 1rem",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: showOnboarding ? "1040px" : "640px",
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(6px)",
            borderRadius: "12px",
            padding: showOnboarding ? "20px 12px" : "24px",
            boxSizing: "border-box",
            transition: "max-width 0.2s ease",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#1a1a1a",
            }}
          >
            Anthology
          </h1>

          {/* ------------------- Short / full version + Onboarding toggles ---------------------- */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "1.5rem",
            }}
          >
            <button
              type="button"
              aria-pressed={!showOnboarding && showFull}
              onClick={() => {
                if (showOnboarding) {
                  setShowOnboarding(false);
                } else {
                  setShowFull((value) => !value);
                }
              }}
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: !showOnboarding ? "#f7fafc" : "rgba(247, 250, 252, 0.75)",
                color: "#2b6cb0",
                fontSize: "14px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {showFull ? t("about.showShort") : t("about.showFull")}
            </button>

            <button
              type="button"
              aria-pressed={showOnboarding}
              onClick={() => setShowOnboarding((value) => !value)}
              style={{
                height: "36px",
                padding: "0 14px",
                borderRadius: "8px",
                border: showOnboarding ? "1px solid #0891b2" : "1px solid #ccc",
                backgroundColor: showOnboarding ? "#0891b2" : "#f7fafc",
                color: showOnboarding ? "#ffffff" : "#0891b2",
                fontSize: "14px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {t("about.onboarding")}
            </button>
          </div>

          {showOnboarding ? (
            <iframe
              ref={iframeRef}
              key={locale}
              src={`/onboarding.html?lang=${locale}`}
              title={t("about.onboardingIframeTitle")}
              onLoad={handleIframeLoad}
              style={{
                width: "100%",
                height: `${iframeHeight}px`,
                border: "none",
                borderRadius: "10px",
                display: "block",
                backgroundColor: "#fdfaf4",
              }}
            />
          ) : !showFull ? (
            /* --------------------------- Short version ------------------------- */
            <>
              <h2 style={headingStyle}>{t("about.shortTitle")}</h2>
              <p style={paragraphStyle}>{t("about.shortIntro")}</p>

              <h2 style={headingStyle}>{t("about.glossaryTitle")}</h2>
              <p style={paragraphStyle}>
                <strong>{t("about.glossaryMemoir")}:</strong>{" "}
                {t("about.shortGlossaryMemoirDesc")}
              </p>
              <p style={paragraphStyle}>
                <strong>{t("about.glossaryAnthology")}:</strong>{" "}
                {t("about.shortGlossaryAnthologyDesc")}
              </p>
              <p style={paragraphStyle}>
                <strong>{t("about.glossaryMemory")}:</strong>{" "}
                {t("about.shortGlossaryMemoryDesc")}
              </p>

              <h2 style={headingStyle}>{t("about.shortHowTitle")}</h2>
              <p style={paragraphStyle}>{t("about.shortHowNoServer")}</p>
              <p style={paragraphStyle}>{t("about.shortHowLocal")}</p>
              <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                {t("about.shortHowChain")}
              </p>
            </>
          ) : (
            /* ---------------------------- Full version ------------------------- */
            <>
              <p style={paragraphStyle}>{t("about.intro")}</p>

              {/* --------------------------- Why memory? --------------------------- */}
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

              {/* ---------------------------- Glossary ----------------------------- */}
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

              {/* -------------------------- 100% static ---------------------------- */}
              <h2 style={headingStyle}>{t("about.staticTitle")}</h2>
              <p style={paragraphStyle}>{t("about.staticNoBackend")}</p>
              <p style={paragraphStyle}>{t("about.staticLocal")}</p>
              <p style={paragraphStyle}>{t("about.staticChain")}</p>
              <p style={paragraphStyle}>{t("about.staticCleanLinks")}</p>

              {/* ------------------ Wallets & smart contracts ---------------------- */}
              <h2 style={headingStyle}>{t("about.walletTitle")}</h2>
              <p style={paragraphStyle}>{t("about.walletIdentity")}</p>
              <p style={paragraphStyle}>{t("about.walletContracts")}</p>

              {/* -------------------- The two smart contracts ---------------------- */}
              <h2 style={headingStyle}>{t("about.contractsTitle")}</h2>
              <h3 style={subHeadingStyle}>{t("about.factoryTitle")}</h3>
              <p style={paragraphStyle}>{t("about.factoryDesc")}</p>
              <h3 style={subHeadingStyle}>{t("about.anthologyTitle")}</h3>
              <p style={{ ...paragraphStyle, marginBottom: 0 }}>
                {t("about.anthologyDesc")}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};
