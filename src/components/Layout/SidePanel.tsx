import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "./Modal";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { useAccount } from "wagmi";
import { LOCAL_USER_PATH } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { CurrentPaths } from "@src/types/common";

export const SidePanel = () => {
  const { userAddr } = useAppSelector((state) => state.user);
  const { isIconToLocal, theme } = useAppSelector((state) => state.dapp);
  const backgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
  const isLight = theme === "light";
  const linkColor = isLight ? "#213547" : "white";
  const { isConnected, address } = useAccount();

  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnClick = (newCurrentPath: CurrentPaths) => {
    dispatch(updateCurrentPath(newCurrentPath));
    window.history.pushState(
      { currentPath: newCurrentPath },
      "",
      window.location.pathname
    );
    handleClose();
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <Modal
      placement="end"
      variant="sidepanel"
      containerClassName={backgroundsEnabled ? "bg-dark-film" : ""}
      show={show}
      onHide={handleClose}
      trigger={
        <div
          onClick={handleShow}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "35px",
            height: "35px",
            border: isLight
              ? "1px solid rgba(0, 0, 0, 0.3)"
              : "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            cursor: "pointer",
            color: linkColor,
            fontSize: "22px",
            background: isLight
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = isLight
              ? "rgba(0, 0, 0, 0.1)"
              : "rgba(255, 255, 255, 0.1)";
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = isLight
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 255, 255, 0.05)";
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          }}
        >
          <span style={{ marginBottom: isMobile ? "0px" : "5px" }}>☰</span>
        </div>
      }
      header={
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
          style={{ width: "100%", display: "flex", alignItems: "center" }}
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
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isConnected && (
            <>
              <Link
                to="/"
                onClick={() => handleOnClick(`user/${userAddr}`)}
                style={{
                  margin: "10px 0px",
                  fontSize: "18px",
                  textDecoration: "none",
                  color: linkColor,
                }}
              >
                My Anthologies
              </Link>
            </>
          )}
          <Link
            to="/"
            onClick={() => handleOnClick("discover")}
            style={{
              margin: "10px 0px",
              fontSize: "18px",
              textDecoration: "none",
              color: linkColor,
            }}
          >
            Discover
          </Link>
          <Link
            to="/"
            onClick={() => handleOnClick(LOCAL_USER_PATH)}
            style={{
              margin: "10px 0px",
              color: linkColor,
              textDecoration: "none",
            }}
          >
            Private Anthologies
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Link
            to="/about"
            onClick={handleClose}
            style={{ textDecoration: "none", marginTop: "20px", color: linkColor }}
          >
            About
          </Link>
          {isConnected && (
            <Link
              to="/info"
              onClick={handleClose}
              style={{ textDecoration: "none", marginTop: "10px", color: linkColor }}
            >
              Factory Info
            </Link>
          )}
          <Link
            to="/settings"
            onClick={handleClose}
            style={{ textDecoration: "none", marginTop: "10px", color: linkColor }}
          >
            Settings
          </Link>
        </div>
      </div>
    </Modal>
  );
};
