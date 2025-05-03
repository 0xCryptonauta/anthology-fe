import { useAppSelector } from "@src/store/utils/hooks";
import { DeployView } from "./factory/DeployView";
import { FactoryView } from "./factory/FactoryView";
import { AccountView } from "./factory/AccountView";
import { AnthologyView } from "./anthology/AnthologyView";

import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { ActiveView } from "@src/types/common";

export const IndexView = () => {
  const { userAddr } = useAppSelector((state) => state.user);

  const { activeView, setActiveView } = useOutletContext<{
    activeView: ActiveView;
    setActiveView: (newActiveView: ActiveView) => void;
  }>();

  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = (event) => {
      if (event.state && event.state.activeView) {
        setActiveView(event.state.activeView); // Restore component from history.state
      } else {
        setActiveView("factory"); // Default state if no history entry
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up listener
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {activeView === "deploy" ? (
        <DeployView />
      ) : activeView === "factory" ? (
        <FactoryView setActiveView={setActiveView} />
      ) : activeView === `user/${userAddr}` ? (
        <AccountView setActiveView={setActiveView} />
      ) : activeView.startsWith(`user/`) ? (
        <div>Other user view</div>
      ) : activeView.startsWith(`contract/`) ? (
        <AnthologyView activeView={activeView} setActiveView={setActiveView} />
      ) : (
        <div>Default View</div>
      )}
    </div>
  );
};
