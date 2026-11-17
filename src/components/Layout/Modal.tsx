import React, {
  useEffect,
  useId,
  useRef,
  useState,
  ReactElement,
  cloneElement,
} from "react";
import { Offcanvas } from "react-bootstrap";
import { useAppSelector } from "@src/store/utils/hooks";
import { getBgClass } from "@src/utils/backgrounds";

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
  maxWidth?: string;
  bodyPadding?: string;
  contentPadding?: string;
  contentMargin?: string;
  backgroundKey?: string;
  disablePattern?: boolean;
  scrollable?: boolean;
  /** Dark sheet for full-height settings panels. */
  surface?: "light" | "dark";
  /** Accessible name for the dialog (Offcanvas has none by default). */
  dialogLabel?: string;
  /** Keep the panel open while a nested modal is used. */
  dismissOnOutsideClick?: boolean;
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
  maxWidth = "315px",
  bodyPadding,
  contentPadding = "10px",
  contentMargin = "3px",
  backgroundKey,
  disablePattern = false,
  scrollable = false,
  surface = "light",
  dialogLabel,
  dismissOnOutsideClick = true,
}: ModalProps) => {
  const [internalShow, setInternalShow] = useState(false);
  const show = externalShow ?? internalShow;
  const generatedId = useId();
  const patternKey = backgroundKey ?? generatedId;
  const categoryBackgroundsEnabled = useAppSelector(
    (state) => state.dapp.categoryBackgroundsEnabled
  );

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
    if (!show || !dismissOnOutsideClick) return;

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
  }, [handleClose, show, dismissOnOutsideClick]);

  const isSidePanel = variant === "sidepanel";
  const isDark = surface === "dark";
  const patterned =
    !isSidePanel &&
    !transparent &&
    !disablePattern &&
    !isDark &&
    categoryBackgroundsEnabled;
  const isPortrait = window.innerHeight > window.innerWidth;
  const resolvedPlacement = placement === "end" ? "end" : "bottom";

  // WCAG 2.1.1 / 4.1.2 — custom (non-button) triggers get keyboard support.
  const nativeInteractiveTags = ["button", "a", "input", "select", "textarea"];
  const triggerNeedsKeyboard =
    !!trigger &&
    typeof trigger.type === "string" &&
    !nativeInteractiveTags.includes(trigger.type as string);

  return (
    <>
      {trigger && (
        <div style={{ cursor: "pointer" }}>
          {cloneElement(trigger, {
            onClick: (e: React.MouseEvent) => {
              trigger.props.onClick?.(e);
              handleShow();
            },
            ...(triggerNeedsKeyboard
              ? {
                  role: "button",
                  tabIndex: 0,
                  "aria-haspopup": "dialog" as const,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    trigger.props.onKeyDown?.(e);
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleShow();
                    }
                  },
                }
              : {}),
          })}
        </div>
      )}

      {show && (
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement={stickToBottom ? "bottom" : resolvedPlacement}
          className={isSidePanel ? (containerClassName || "") : ""}
          data-bs-theme={isSidePanel || isDark ? "dark" : undefined}
          aria-label={dialogLabel}
          style={{
            width: isSidePanel ? "200px" : undefined,
            height:
              !isSidePanel && placement !== "end"
                ? height ?? "min(600px, 90dvh)"
                : undefined,
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
              padding: bodyPadding,
              overflow: scrollable ? "hidden" : undefined,
            }}
          >
            <div
              ref={offcanvasRef}
              className={
                patterned
                  ? `modal-pattern ${getBgClass(patternKey)}`
                  : undefined
              }
              style={{
                backgroundColor:
                  isSidePanel || transparent
                    ? "transparent"
                    : isDark
                    ? "#0d1117"
                    : patterned
                    ? "transparent"
                    : "white",
                color:
                  isSidePanel || transparent
                    ? undefined
                    : isDark
                    ? "#e6edf3"
                    : "#1a1a1a",
                border:
                  isSidePanel || transparent
                    ? "none"
                    : isDark
                    ? "1px solid #30363d"
                    : "1px solid black",
                borderRadius: isDark ? "14px" : "7px",
                padding: contentPadding,
                margin: isSidePanel ? "0px" : contentMargin,
                width: transparent ? "unset" : "100%",
                height: isSidePanel ? "100%" : "unset",
                maxWidth: isSidePanel || transparent ? "100%" : maxWidth,
                maxHeight: "calc(100% - 6px)",
                overflowY: scrollable ? "auto" : undefined,
                minHeight: scrollable ? 0 : undefined,
                WebkitOverflowScrolling: scrollable ? "touch" : undefined,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {children}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </>
  );
};
