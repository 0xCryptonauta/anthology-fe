import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "./Modal";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { useAccount } from "wagmi";
import { LOCAL_USER_PATH } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { CurrentPaths } from "@src/types/common";
import { useTranslation } from "@src/i18n/useTranslation";

export const SidePanel = () => {
  const { t } = useTranslation();
  const { userAddr } = useAppSelector((state) => state.user);
  const { isIconToLocal } = useAppSelector((state) => state.dapp);
  const backgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);
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
        <button
          type="button"
          aria-label={t("a11y.sidePanel")}
          aria-haspopup="dialog"
          aria-expanded={show}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "35px",
            height: "35px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            cursor: "pointer",
            color: "white",
            fontSize: "22px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            transition: "background 0.2s, transform 0.2s",
          }}
          onClick={handleShow}
        >
          <span style={{ marginBottom: isMobile ? "0px" : "5px" }}>☰</span>
        </button>
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
            src="/IB_icon-60.png"
            alt="Logo"
            width="30"
            height="29"
            className="d-inline-block align-text-top"
            style={{ marginLeft: "5px", width: "30px", height: "29px" }}
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
                  color: "white",
                }}
              >
                {t("nav.myAnthologies")}
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
              color: "white",
            }}
          >
            {t("nav.discover")}
          </Link>
          <Link
            to="/"
            onClick={() => handleOnClick(LOCAL_USER_PATH)}
            style={{
              margin: "10px 0px",
              color: "white",
              textDecoration: "none",
            }}
          >
            {t("nav.privateMemory")}
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
            style={{ textDecoration: "none", marginTop: "20px", color: "white" }}
          >
            {t("nav.about")}
          </Link>
          {isConnected && (
            <Link
              to="/info"
              onClick={handleClose}
              style={{ textDecoration: "none", marginTop: "10px", color: "white" }}
            >
              {t("nav.factoryInfo")}
            </Link>
          )}
          <Link
            to="/settings"
            onClick={handleClose}
            style={{ textDecoration: "none", marginTop: "10px", color: "white" }}
          >
            {t("nav.settings")}
          </Link>
        </div>
      </div>
    </Modal>
  );
};
