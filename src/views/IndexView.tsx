import { useAppSelector } from "@src/store/utils/hooks";
import { CurrentUserView } from "./factory/CurrentUserView";
import { AnthologyView } from "./anthology/AnthologyView";
import { Address } from "@src/types/common";
import { UserView } from "./factory/UserView";
import { useHistoryState } from "@src/hooks/useHistoryState";
import { LOCAL_USER_PATH } from "@src/utils/constants";
import { LocalUserView } from "./factory/LocalUserView";
import { LocalAnthologyView } from "./anthology/LocalAnthologyView";
import { DiscoverView } from "./factory/DiscoverView";

export const IndexView = () => {
  const { userAddr, currentPath } = useAppSelector((state) => state.user);

  useHistoryState();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {currentPath === `discover` ? (
        <DiscoverView />
      ) : currentPath === `user/${userAddr}` ? (
        <CurrentUserView /> //add local memoirs?
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
        <div>Default View</div>
      )}
    </div>
  );
};
