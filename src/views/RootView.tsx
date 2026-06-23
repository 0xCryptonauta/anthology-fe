import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";

export const RootView = () => {
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
        className="bg-dark"
        style={{ color: "white" }}
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
