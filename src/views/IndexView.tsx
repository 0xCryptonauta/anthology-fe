import { useAppSelector } from "@src/store/utils/hooks";
import { DeployView } from "./factory/DeployView";
import { FactoryView } from "./factory/FactoryView";
import { CurrentUserView } from "./factory/CurrentUserView";
import { AnthologyView } from "./anthology/AnthologyView";

import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { ActiveView } from "@src/types/common";
import { UserView } from "./factory/UserView";

export const IndexView = () => {
  const { userAddr } = useAppSelector((state) => state.user);

  const { activeView, setActiveView } = useOutletContext<{
    activeView: ActiveView;
    setActiveView: (newActiveView: ActiveView) => void;
  }>();

  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.activeView) {
        setActiveView(event.state.activeView); // Restore component from history.state
      } else {
        setActiveView("factory"); // Default state if no history entry
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up listener
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setActiveView]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {activeView === "deploy" ? (
        <DeployView />
      ) : activeView === "factory" ? (
        <FactoryView setActiveView={setActiveView} />
      ) : activeView === `user/${userAddr}` ? (
        <CurrentUserView setActiveView={setActiveView} />
      ) : activeView.startsWith(`user/`) ? (
        <UserView
          setActiveView={setActiveView}
          userAddr={activeView.split("/")[1]}
        />
      ) : activeView.startsWith(`contract/`) ? (
        <AnthologyView activeView={activeView} setActiveView={setActiveView} />
      ) : (
        <div>Default View</div>
      )}
    </div>
  );
};
