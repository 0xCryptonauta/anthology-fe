import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";
import { PwaInstallPrompt } from "@components/Layout/PwaInstallPrompt";
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
      {/* The header lives outside the pattern grid: `position: sticky` on a grid
          item is trapped inside its grid row, and `.bg-overlay > *` would force
          `position: relative` on it. The shell owns the viewport height. */}
      <div
        className="app-shell"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
        }}
      >
        <Header />
        <div
          className={backgroundsEnabled ? (footerBgClass || "bg-overlay bg-arabesque-style") : "bg-dark"}
          style={{
            display: "grid",
            gridTemplateRows: "1fr auto",
            gridTemplateColumns: "minmax(0, 1fr)",
            flex: 1,
            minWidth: 0,
          }}
        >
          <main
            id="main-content"
            tabIndex={-1}
            style={{
              color: "white",
              outline: "none",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <PwaInstallPrompt />
    </>
  );
};
