import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  cloneElement,
} from "react";
import { Offcanvas } from "react-bootstrap";

type ModalProps = {
  placement: "top" | "bottom" | "end";
  children: React.ReactNode;
  trigger: ReactElement;
  show?: boolean;
  onHide?: () => void;
};

export const Modal = ({
  placement,
  children,
  trigger,
  show: externalShow,
  onHide,
}: ModalProps) => {
  // Internal state used only if component is uncontrolled
  const [internalShow, setInternalShow] = useState(false);
  const show = externalShow ?? internalShow;

  const handleClose = () => {
    if (onHide) {
      onHide();
    } else {
      setInternalShow(false);
    }
  };

  const handleShow = () => {
    if (!onHide) {
      setInternalShow(true);
    }
  };

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
  }, [onHide]);

  return (
    <>
      <div style={{ cursor: "pointer" }}>
        {cloneElement(trigger, {
          onClick: (e: React.MouseEvent) => {
            trigger.props.onClick?.(e);
            handleShow();
          },
        })}
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement={
          placement === "end"
            ? "end"
            : window.innerHeight > window.innerWidth
            ? "top"
            : "bottom"
        }
        style={{
          height: "450px",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <Offcanvas.Body
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "transparent",
          }}
        >
          <div
            ref={offcanvasRef}
            onClick={(e) => e.stopPropagation()}
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
            }}
          >
            {children}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
