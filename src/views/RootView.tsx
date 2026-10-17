import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";
import { useAppSelector } from "@store/utils/hooks";
import "@src/styles/backgrounds.css";

export const RootView = () => {
  const backgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const footerBgClass = useAppSelector((s) => s.dapp.anthologyFooterBgClass);
  const theme = useAppSelector((s) => s.dapp.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const isLight = theme === "light";
  const rootClass = isLight
    ? ""
    : backgroundsEnabled
    ? footerBgClass || "bg-overlay bg-arabesque-style"
    : "bg-dark";

  return (
    <div
      className={rootClass}
      style={{
        display: "grid",
        minHeight: "100dvh",
        gridTemplateRows: "auto 1fr auto",
        backgroundColor: isLight ? "#f5f5f5" : undefined,
      }}
    >
      <Header />
      <div style={{ color: isLight ? "#213547" : "white" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
