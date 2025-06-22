import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "./Modal";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { useAccount } from "wagmi";
import { LOCAL_ANTOLOGY_PATH } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { CurrentPaths } from "@src/types/common";

export const SidePanel = () => {
  const { userAddr } = useAppSelector((state) => state.user);
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
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

  return (
    <Modal
      placement="end"
      variant="sidepanel"
      show={show}
      onHide={handleClose}
      trigger={
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
      }
      header={
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
                }}
              >
                My Anthologies
              </Link>
              <Link
                to="/"
                onClick={() => handleOnClick("discover")}
                style={{
                  margin: "10px 0px",
                  fontSize: "18px",
                  textDecoration: "none",
                }}
              >
                Discover
              </Link>
            </>
          )}
          <Link
            to="/"
            onClick={() => handleOnClick(LOCAL_ANTOLOGY_PATH)}
            style={{
              margin: "10px 0px",
              color: "#ff8383",
              textDecoration: "none",
            }}
          >
            Draft Anthologies
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
            style={{ textDecoration: "none", marginTop: "20px" }}
          >
            About
          </Link>
          {isConnected && (
            <Link
              to="/info"
              onClick={handleClose}
              style={{ textDecoration: "none", marginTop: "10px" }}
            >
              Factory Info
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};
