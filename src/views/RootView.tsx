import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";
import { useAppSelector } from "@store/utils/hooks";
import "@src/styles/backgrounds.css";

export const RootView = () => {
  const backgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);

  return (
    <div
      style={{
        display: "grid",
        minHeight: "100dvh",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Header />
      <div
        className={backgroundsEnabled ? "bg-overlay bg-arabesque-style" : "bg-dark"}
        style={{ color: "white" }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
