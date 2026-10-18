import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";
import { useAppSelector } from "@store/utils/hooks";
import { useTranslation } from "@src/i18n/useTranslation";
import "@src/styles/backgrounds.css";

export const RootView = () => {
  const { t } = useTranslation();
  const backgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const footerBgClass = useAppSelector((s) => s.dapp.anthologyFooterBgClass);

  return (
    <>
      {/* Skip link lives outside the grid container: `.bg-overlay > *` forces
          `position: relative` on direct children, which would turn the link
          into a grid row and push the header down. */}
      <a href="#main-content" className="skip-link">
        {t("a11y.skipToMain")}
      </a>
      <div
        className={backgroundsEnabled ? (footerBgClass || "bg-overlay bg-arabesque-style") : "bg-dark"}
        style={{
          display: "grid",
          minHeight: "100dvh",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          style={{ color: "white", outline: "none" }}
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};
