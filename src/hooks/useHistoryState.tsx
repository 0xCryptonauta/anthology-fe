import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
/* import { CurrentPaths } from "@src/types/common";
import { LOCAL_ANTOLOGY_PATH } from "@src/utils/constants"; */
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const useHistoryState = () => {
  const { address, isConnected } = useAccount();
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
  const { currentPath } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  /*   let defaultCurrentPath = LOCAL_ANTOLOGY_PATH as CurrentPaths;

  if (isConnected && !isIconToLocal) {
    defaultCurrentPath = `user/${address}`;
  } */

  useEffect(() => {
    const resetHistoryState = () => {
      window.history.replaceState({ currentPath: currentPath }, "");
      dispatch(updateCurrentPath(currentPath));
    };

    resetHistoryState();

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.currentPath) {
        dispatch(updateCurrentPath(event.state.currentPath));
      } else {
        dispatch(updateCurrentPath(currentPath));
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
  }, [currentPath, dispatch, address, isConnected, isIconToLocal]);
};
