import { Outlet } from "react-router-dom";
import { Header } from "@components/Layout/Header";
import { Footer } from "@components/Layout/Footer";
import { useGetFactoryInfo } from "@src/hooks/useGetFactoryInfo";
import { useEffect, useState } from "react";
import { ActiveView } from "@src/types/common";

export const RootView = () => {
  useGetFactoryInfo();

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const saved = localStorage.getItem("activeView");
    return saved ? JSON.parse(saved) : "factory";
  });

  useEffect(() => {
    localStorage.setItem("activeView", JSON.stringify(activeView));
  }, [activeView]);

  return (
    <div
      style={{
        display: "grid",
        minHeight: "100dvh",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Header activeView={activeView} setActiveView={setActiveView} />
      <div
        className="bg-dark"
        style={{ color: "white" }} // -64 of the Header height
      >
        <Outlet context={{ activeView, setActiveView }} />
      </div>
      <Footer />
    </div>
  );
};
