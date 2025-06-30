import React, {
  useEffect,
  useRef,
  useState,
  ReactElement,
  cloneElement,
} from "react";
import { Offcanvas } from "react-bootstrap";

type ModalProps = {
  placement?: "top" | "bottom" | "end";
  children: React.ReactNode;
  trigger?: ReactElement;
  header?: ReactElement;
  show?: boolean;
  onHide?: () => void;
  variant?: "modal" | "sidepanel";
  transparent?: boolean;
  stickToBottom?: boolean;
};

export const Modal = ({
  placement = "bottom",
  children,
  trigger,
  header,
  show: externalShow,
  onHide,
  variant = "modal",
  transparent = false,
  stickToBottom = false,
}: ModalProps) => {
  const [internalShow, setInternalShow] = useState(false);
  const show = externalShow ?? internalShow;

  const handleClose = React.useCallback(() => {
    if (onHide) onHide();
    else setInternalShow(false);
  }, [onHide]);

  const handleShow = () => {
    if (!onHide) setInternalShow(true);
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
  }, [onHide, handleClose]);

  const isSidePanel = variant === "sidepanel";
  const resolvedPlacement =
    placement === "end"
      ? "end"
      : window.innerHeight > window.innerWidth
      ? "top"
      : "bottom";

  return (
    <>
      {trigger && (
        <div style={{ cursor: "pointer" }}>
          {cloneElement(trigger, {
            onClick: (e: React.MouseEvent) => {
              trigger.props.onClick?.(e);
              handleShow();
            },
          })}
        </div>
      )}

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement={stickToBottom ? "bottom" : resolvedPlacement}
        className={isSidePanel ? "bg-dark" : ""}
        data-bs-theme={isSidePanel ? "dark" : undefined}
        style={{
          width: isSidePanel ? "200px" : undefined,
          height: !isSidePanel && placement !== "end" ? "500px" : undefined,
          backgroundColor: "transparent",
          border: "unset",
          display: "flex",
          flexDirection: isSidePanel ? "column" : "row",
          alignItems: isSidePanel ? "center" : "flex-end",
        }}
      >
        {header && (
          <Offcanvas.Header style={{ justifyContent: "center" }}>
            {header}
          </Offcanvas.Header>
        )}

        <Offcanvas.Body
          style={{
            display: transparent ? "unset" : "flex",
            width: "100%",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "transparent",
          }}
        >
          <div
            ref={offcanvasRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor:
                isSidePanel || transparent ? "transparent" : "white",
              border: isSidePanel || transparent ? "none" : "1px solid black",
              borderRadius: "7px",
              padding: "10px",
              margin: isSidePanel ? "0px" : "3px",
              width: transparent ? "unset" : "100%",
              height: isSidePanel ? "100%" : "unset",
              maxWidth: isSidePanel || transparent ? "100%" : "300px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {children}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
