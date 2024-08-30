import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

export const SidePanel = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="secondary" onClick={handleShow} className="me-2">
        🔑
      </Button>

      <Offcanvas
        placement="end"
        className="bg-dark"
        data-bs-theme="dark"
        show={show}
        onHide={handleClose}
        style={{ width: "200px" }}
      >
        <Offcanvas.Header style={{ justifyContent: "center" }}>
          <a
            className="navbar-brand"
            href="#"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="IB_icon.png"
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
              style={{ marginLeft: "5px" }}
            />
            <span style={{ marginLeft: "10px", fontSize: "25px" }}>
              inBytes
            </span>
          </a>
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
            <div style={{ margin: "20px 0px", fontSize: "24px" }}>The Wall</div>
            <div style={{ margin: "20px 0px" }}>My contracts</div>
            <div style={{ margin: "20px 0px" }}>Contract Info</div>
          </div>
          <div>About</div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
