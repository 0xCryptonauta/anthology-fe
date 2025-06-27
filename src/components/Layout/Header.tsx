import { Link } from "react-router-dom";
import { SidePanel } from "./SidePanel";
import { WalletConnector } from "./WalletConnector";
import { useAccount } from "wagmi";
import { LOCAL_USER_PATH } from "@src/utils/constants";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { CurrentPaths } from "@src/types/common";
import { updateCurrentPath } from "@src/store/slices/userSlice";

export const Header = () => {
  const { isConnected, address } = useAccount();
  const { isIconToLocal } = useAppSelector((state) => state.dapp);

  const dispatch = useAppDispatch();

  const handleOnClick = (newCurrentPath: CurrentPaths) => {
    dispatch(updateCurrentPath(newCurrentPath));

    // Push new history entry without changing URL
    window.history.pushState(
      { currentPath: newCurrentPath }, // Store component name in history.state
      "", // Unused title
      window.location.pathname // Keep URL as `/`
    );
  };

  return (
    <nav className="navbar bg-dark" data-bs-theme="dark">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          onClick={() => {
            if (isConnected && !isIconToLocal) {
              handleOnClick(`user/${address}`);
            } else {
              handleOnClick(LOCAL_USER_PATH);
            }
          }}
        >
          <img
            src="/IB_icon.png"
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
            style={{ marginLeft: "5px" }}
          />
        </Link>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <WalletConnector />
          <SidePanel />
        </div>
      </div>
    </nav>
  );
};
