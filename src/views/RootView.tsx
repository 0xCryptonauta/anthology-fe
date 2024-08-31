import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const RootView = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <div
        className="bg-dark"
        style={{ minHeight: "calc(100svh - 64px)", color: "white" }} // -64 of the Header height
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
