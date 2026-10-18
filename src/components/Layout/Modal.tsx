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
  containerClassName?: string;
  height?: string;
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
  containerClassName,
  height,
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

  // Close when a press starts outside the panel. Pointer events cover mouse,
  // touch and pen uniformly, so taps on mobile close the modal reliably.
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (
        offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handleClose]);

  const isSidePanel = variant === "sidepanel";
  const isPortrait = window.innerHeight > window.innerWidth;
  const resolvedPlacement = placement === "end" ? "end" : "bottom";

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
        className={isSidePanel ? (containerClassName || "") : ""}
        data-bs-theme={isSidePanel ? "dark" : undefined}
        style={{
          width: isSidePanel ? "200px" : undefined,
          height: !isSidePanel && placement !== "end" ? height ?? "min(600px, 90dvh)" : undefined,
          bottom: !isSidePanel && isPortrait ? "40px" : undefined,
          backgroundColor: "transparent",
          border: "unset",
          display: "flex",
          flexDirection: isSidePanel ? "column" : "row",
          alignItems: isSidePanel ? "center" : "stretch",
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
            justifyContent:
              isSidePanel || transparent
                ? undefined
                : isPortrait
                ? "flex-start"
                : "flex-end",
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
              maxWidth: isSidePanel || transparent ? "100%" : "315px",
              maxHeight: "calc(100% - 6px)",
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
