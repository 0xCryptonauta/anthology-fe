import { ActiveView } from "@src/types/common";
import { LOCAL_ANTOLOGY_PATH } from "@src/utils/constants";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const useHistoryState = (
  setActiveView: (activeView: ActiveView) => void
) => {
  const { address, isConnected } = useAccount();

  let defaultView = LOCAL_ANTOLOGY_PATH as ActiveView;

  if (isConnected) {
    defaultView = `user/${address}`;
  }

  useEffect(() => {
    const resetHistoryState = () => {
      window.history.replaceState({ activeView: defaultView }, "");
      setActiveView(defaultView);
    };

    resetHistoryState();

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.activeView) {
        setActiveView(event.state.activeView);
      } else {
        setActiveView(defaultView);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resetHistoryState();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow as EventListener);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow as EventListener);
    };
  }, [setActiveView, defaultView]);
};
