import { useAppSelector } from "@src/store/utils/hooks";
import { DeployView } from "./factory/DeployView";
//import { FactoryUsersView } from "./factory/FactoryUsersView";
import { CurrentUserView } from "./factory/CurrentUserView";
import { AnthologyView } from "./anthology/AnthologyView";

import { useOutletContext } from "react-router-dom";
import { ActiveView } from "@src/types/common";
import { UserView } from "./factory/UserView";
import { useHistoryState } from "@src/hooks/useHistoryState";

export const IndexView = () => {
  const { userAddr } = useAppSelector((state) => state.user);

  const { activeView, setActiveView } = useOutletContext<{
    activeView: ActiveView;
    setActiveView: (newActiveView: ActiveView) => void;
  }>();

  useHistoryState(setActiveView);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {activeView === "deploy" ? (
        <DeployView />
      ) : /*       ) : activeView === "factory" ? (
        <FactoryUsersView setActiveView={setActiveView} /> */
      activeView === `user/${userAddr}` ? (
        <CurrentUserView setActiveView={setActiveView} /> //add local memoirs?
      ) : activeView === "user/My Memoirs" ? (
        <div> Only local Memoirs </div>
      ) : //<LocalUserView setActiveView={setActiveView} /> //Only local memoirs
      activeView.startsWith(`user/`) ? (
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
