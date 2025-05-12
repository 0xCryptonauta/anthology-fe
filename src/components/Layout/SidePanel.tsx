import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";

import { useAppSelector } from "@store/utils/hooks";
//import { updateActiveView } from "@src/store/slices/userSlice";
import { ActiveView } from "@src/types/common";
import { NetworkSettings } from "./NetworkSettings";
interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (newActiveView: ActiveView) => void;
}

export const SidePanel: React.FC<HeaderProps> = ({ setActiveView }) => {
  const { userAddr } = useAppSelector((state) => state.user);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnClick = (newActiveView: ActiveView) => {
    setActiveView(newActiveView); // Update local state

    // Push new history entry without changing URL
    window.history.pushState(
      { activeView: newActiveView }, // Store component name in history.state
      "", // Unused title
      window.location.pathname // Keep URL as `/`
    );

    handleClose();
  };

  return (
    <>
      <div
        onClick={handleShow}
        style={{
          display: "flex",
          justifyContent: "Center",
          alignItems: "center",
          width: "30px",
          height: "30px",
          border: "1px solid white",
          borderRadius: "7px",
          cursor: "pointer",
          color: "white",
        }}
      >
        ☰
      </div>

      <Offcanvas
        placement="end"
        className="bg-warning"
        data-bs-theme="dark"
        show={show}
        onHide={handleClose}
        style={{
          width: "200px",
        }}
      >
        <Offcanvas.Header style={{ justifyContent: "center" }}>
          <Link
            className="navbar-brand"
            to="/"
            onClick={() => {
              handleOnClick(`factory`);
            }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/IB_icon.png"
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
              style={{ marginLeft: "5px" }}
            />
            {/* <span style={{ marginLeft: "10px", fontSize: "25px" }}>
              inBytes
            </span> */}
          </Link>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {/* <div style={{ margin: "20px 0px", fontSize: "24px" }}>
              <Link to="/" onClick={handleClose}>
                e-Brain
              </Link>
            </div> */}
            {userAddr && (
              <div style={{ margin: "20px 0px" }}>
                <Link
                  to="/"
                  style={{ cursor: "pointer", margin: "10px 0px" }}
                  onClick={() => {
                    handleOnClick(`user/${userAddr}`);
                  }}
                >
                  My anthologies
                </Link>
                <br />
                <Link
                  to="/"
                  style={{ cursor: "pointer", margin: "10px 0px" }}
                  onClick={() => {
                    handleOnClick(`deploy`);
                  }}
                >
                  Deploy
                </Link>
              </div>
            )}
            <br />
            <Link
              to="/"
              style={{ cursor: "pointer", margin: "10px 0px" }}
              onClick={() => {
                handleOnClick(`factory`);
              }}
            >
              Factory
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                margin: "20px 0px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Link to="about" onClick={handleClose}>
                About
              </Link>
              <br />
              <Link to="/info" onClick={handleClose}>
                Factory Info
              </Link>
              <br />
              <div>
                <NetworkSettings />
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
