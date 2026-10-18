import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { CurrentPaths } from "@src/types/common";
import { useEffect } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

export const useHistoryState = () => {
  const { address, isConnected } = useAccount();
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
  const { currentPath } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const contractParam =
      params.get("contract") || params.get("anthology");
    const userParam = params.get("user");

    if (contractParam && isAddress(contractParam)) {
      const targetPath = `contract/${contractParam}` as CurrentPaths;
      dispatch(updateCurrentPath(targetPath));
      window.history.replaceState(
        { currentPath: targetPath },
        "",
        window.location.pathname
      );
      return;
    }

    if (userParam && isAddress(userParam)) {
      const targetPath = `user/${userParam}` as CurrentPaths;
      dispatch(updateCurrentPath(targetPath));
      window.history.replaceState(
        { currentPath: targetPath },
        "",
        window.location.pathname
      );
      return;
    }
  }, [dispatch]);

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
