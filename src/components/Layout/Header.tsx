import { Link } from "react-router-dom";
import { SidePanel } from "./SidePanel";
import { WalletConnector } from "./WalletConnector";
import { ActiveView } from "@src/types/common";
interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (newActiveView: ActiveView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
}) => {
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
          onClick={() => handleOnClick("user/My Memoirs")}
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
