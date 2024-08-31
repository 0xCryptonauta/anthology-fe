import { Link } from "react-router-dom";
import { SidePanel } from "./SidePanel";
import { WalletConnector } from "./WalletConnector";
/* import { WalletConnector } from "./WalletConnector"; */

export const Header = () => {
  return (
    <nav
      //className="navbar bg-primary"
      //data-bs-theme="dark"
      className="navbar bg-dark"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="IB_icon.png"
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
            style={{ marginLeft: "5px" }}
          />
          {/* <span style={{ marginLeft: "10px", fontSize: "25px" }}>
            Anthology
          </span> */}
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
