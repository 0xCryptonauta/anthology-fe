import { Link } from "react-router-dom";
import { SidePanel } from "./SidePanel";
import { WalletConnector } from "./WalletConnector";
import { ActiveView } from "@src/types/common";
import { useAccount } from "wagmi";
import { LOCAL_ANTOLOGY_PATH } from "@src/utils/constants";
import { useAppSelector } from "@src/store/utils/hooks";
interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (newActiveView: ActiveView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
}) => {
  const { isConnected, address } = useAccount();
  const { isIconToLocal } = useAppSelector((state) => state.dapp);

  const handleOnClick = (newActiveView: ActiveView) => {
    setActiveView(newActiveView); // Update local state

    // Push new history entry without changing URL
    window.history.pushState(
      { activeView: newActiveView }, // Store component name in history.state
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
              handleOnClick(LOCAL_ANTOLOGY_PATH);
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
          <SidePanel activeView={activeView} setActiveView={setActiveView} />
        </div>
      </div>
    </nav>
  );
};
