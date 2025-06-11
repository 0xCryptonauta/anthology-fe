import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { useAccount } from "wagmi";
import { LOCAL_ANTOLOGY_PATH } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { CurrentPaths } from "@src/types/common";

export const SidePanel = () => {
  const { userAddr } = useAppSelector((state) => state.user);
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
  const [show, setShow] = useState(false);

  const { isConnected, address } = useAccount();

  const dispatch = useAppDispatch();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnClick = (newCurrentPath: CurrentPaths) => {
    dispatch(updateCurrentPath(newCurrentPath));

    // Push new history entry without changing URL
    window.history.pushState(
      { currentPath: newCurrentPath }, // Store component name in history.state
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
        className="bg-dark"
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
              if (isConnected && !isIconToLocal) {
                handleOnClick(`user/${address}`);
              } else {
                handleOnClick(LOCAL_ANTOLOGY_PATH);
              }
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
            {isConnected && (
              <div style={{ margin: "0px 0px" }}>
                <div style={{ margin: "10px 0px" }}>
                  <Link
                    to="/"
                    style={{
                      cursor: "pointer",
                      margin: "10px 0px",
                      fontSize: "18px",
                      textDecoration: "none",
                    }}
                    onClick={() => {
                      handleOnClick(`user/${userAddr}`);
                    }}
                  >
                    My Anthologies
                  </Link>
                </div>

                <div style={{ margin: "10px 0px" }}>
                  <Link
                    to="/"
                    style={{
                      cursor: "pointer",
                      margin: "10px 0px",
                      fontSize: "18px",
                      textDecoration: "none",
                    }}
                    onClick={() => {
                      handleOnClick(`telepathy`);
                    }}
                  >
                    Telepathy
                  </Link>
                </div>

                {/*                 <br />
                <Link
                  to="/"
                  style={{ cursor: "pointer", margin: "10px 0px" }}
                  onClick={() => {
                    handleOnClick(`deploy`);
                  }}
                >
                  Deploy
                </Link> */}
              </div>
            )}
            <div style={{ margin: "20px 0px" }}>
              <Link
                to="/"
                style={{
                  cursor: "pointer",
                  margin: "10px 0px",
                  color: "#ff8383",
                  textDecoration: "none",
                }}
                onClick={() => {
                  handleOnClick(LOCAL_ANTOLOGY_PATH);
                }}
              >
                Draft Anthologies
              </Link>
              {/*                 <br />
                <Link
                  to="/"
                  style={{ cursor: "pointer", margin: "10px 0px" }}
                  onClick={() => {
                    handleOnClick(`deploy`);
                  }}
                >
                  Deploy
                </Link> */}
            </div>

            {/*             <br />
            <Link
              to="/"
              style={{ cursor: "pointer", margin: "10px 0px" }}
              onClick={() => {
                handleOnClick(`factory`);
              }}
            >
              Factory Users
            </Link> */}
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
              <Link
                to="about"
                onClick={handleClose}
                style={{ textDecoration: "none" }}
              >
                About
              </Link>

              {isConnected && (
                <>
                  <br />
                  <Link
                    to="/info"
                    onClick={handleClose}
                    style={{ textDecoration: "none" }}
                  >
                    Factory Info
                  </Link>
                </>
              )}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
