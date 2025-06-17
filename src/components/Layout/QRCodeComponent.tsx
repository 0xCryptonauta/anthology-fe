import { useEffect, useRef, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";

export const QRCodeComponent = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  //const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const offcanvasRef = useRef<HTMLDivElement>(null);

  const mouseDownRef = useRef(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current =
        !!offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      const isSelectingText =
        selection &&
        selection.type === "Range" &&
        selection.toString().length > 0;

      if (
        mouseDownRef.current &&
        !isSelectingText &&
        offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
      mouseDownRef.current = false;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div>
      <div onClick={handleShow} style={{ cursor: "pointer" }}>
        <img
          src="icons/qrIcon.svg"
          width="52px"
          onClick={handleShow}
          alt="qrIcon"
        />
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        //onClick={handleClose}
        placement={window.innerHeight > window.innerWidth ? "top" : "bottom"}
        //className="bg-dark"
        style={{
          height: "450px",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Offcanvas.Body
          //onClick={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "transparent !important",
          }}
        >
          <div
            ref={offcanvasRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              border: "1px solid black",
              padding: "10px",
              borderRadius: "7px",
              margin: "3px",
              maxWidth: "300px",
              //width: "fit-content",
            }}
          >
            <QRCodeSVG
              value={text}
              size={256}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              includeMargin={true}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};
