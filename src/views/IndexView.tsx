import { lazy, Suspense } from "react";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { useHistoryState } from "@src/hooks/useHistoryState";
import { LOCAL_USER_PATH } from "@src/utils/constants";
import { LocalUserView } from "./factory/LocalUserView";
import { Seo } from "@components/Layout/Seo";

const CurrentUserView = lazy(() =>
  import("./factory/CurrentUserView").then((m) => ({
    default: m.CurrentUserView,
  }))
);
const AnthologyView = lazy(() =>
  import("./anthology/AnthologyView").then((m) => ({
    default: m.AnthologyView,
  }))
);
const UserView = lazy(() =>
  import("./factory/UserView").then((m) => ({
    default: m.UserView,
  }))
);
const LocalAnthologyView = lazy(() =>
  import("./anthology/LocalAnthologyView").then((m) => ({
    default: m.LocalAnthologyView,
  }))
);
const DiscoverView = lazy(() =>
  import("./factory/DiscoverView").then((m) => ({
    default: m.DiscoverView,
  }))
);

export const IndexView = () => {
  const { userAddr, currentPath } = useAppSelector((state) => state.user);

  useHistoryState();

  return (
    <>
      <Seo />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
        <Suspense fallback={null}>
          {currentPath === `discover` ? (
            <DiscoverView />
          ) : currentPath === `user/${userAddr}` ? (
            <CurrentUserView />
          ) : currentPath === LOCAL_USER_PATH ? (
            <LocalUserView />
          ) : currentPath.startsWith(`user/`) ? (
            <UserView userAddr={currentPath.split("/")[1] as Address} />
          ) : currentPath.startsWith(`contract/`) ? (
            currentPath.split("/")[1].length === 22 ? (
              <LocalAnthologyView />
            ) : (
              <AnthologyView />
            )
          ) : (
            <LocalUserView />
          )}
        </Suspense>
      </div>
    </>
  );
};
