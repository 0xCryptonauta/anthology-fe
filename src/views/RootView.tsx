import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";
import { useAppSelector } from "@store/utils/hooks";
import "@src/styles/backgrounds.css";

export const RootView = () => {
  const backgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const footerBgClass = useAppSelector((s) => s.dapp.anthologyFooterBgClass);

  return (
    <div
      className={backgroundsEnabled ? (footerBgClass || "bg-overlay bg-arabesque-style") : "bg-dark"}
      style={{
        display: "grid",
        minHeight: "100dvh",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Header />
      <div
        style={{ color: "white" }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
