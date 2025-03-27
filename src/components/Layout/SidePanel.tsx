import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { RootState } from "../../store/redux";
import { useSelector } from "react-redux";

export const SidePanel = () => {
  const { userAddr } = useSelector((state: RootState) => state.user);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            onClick={handleClose}
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
                <Link to="/account" onClick={handleClose}>
                  My anthologies
                </Link>
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link to="/info" onClick={handleClose}>
              Factory Info
            </Link>
            <br />
            <Link to="about" onClick={handleClose}>
              About
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
