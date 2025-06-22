import { useEffect, useMemo, useRef, useState } from "react";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import "./style.css";
import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { Address } from "@src/types/common";
import { addMemoirToUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { removeSocialTracking } from "@src/utils/removeSocialTracking";
import { HighlightDifferences } from "../Layout/HighlightDifferences";
import { Modal } from "../Layout/Modal";

export const AddMemoir = ({
  contractAddr,
  title = "",
  content = "",
}: {
  contractAddr: Address;
  title?: string;
  content?: string;
}) => {
  const [anthologyTitle, setAnthologyTitle] = useState(title);
  const [anthologyContent, setAnthologyContent] = useState(content);

  const [shouldFilterTracking, setShouldFilterTracking] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const { userAddr, currentPath } = useAppSelector((state) => state.user);
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.anthology[contractAddr]?.anthologyState || ""
  );
  const whitelist = useAppSelector(
    (state) => state.anthology[contractAddr]?.whitelist
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { addToast } = useToast();

  const filteredContent = useMemo(() => {
    return shouldFilterTracking
      ? removeSocialTracking(anthologyContent)
      : anthologyContent;
  }, [shouldFilterTracking, anthologyContent]);

  const handleAddMemoir = async () => {
    if (isLocalAnthology(contractAddr)) {
      dispatch(
        addMemoirToUserLocalAnthology({
          contract: contractAddr,
          memoir: {
            sender: LOCAL_USER_ADDR,
            title: anthologyTitle,
            content: filteredContent,
            timestamp: String(Math.floor(new Date().getTime() / 1000)),
          },
        })
      );
      setAnthologyContent("");
      setAnthologyTitle("");
      addToast({
        title: "Memoir Added",
        content: "Memoir added locally, not on blockchain yet",
        variant: "success",
        delay: 5000,
      });
    } else {
      const txHash_setTitle = await writeAnthology(
        contractAddr,
        "createMemoir",
        [anthologyTitle, filteredContent]
      );
      if (txHash_setTitle) {
        setAnthologyContent("");
        setAnthologyTitle("");
        addToast({
          title: "Memoir Added",
          content: "TxHash: " + txHash_setTitle,
          variant: "success",
          delay: 5000,
        });
      }
    }
    if (currentPath !== `contract/${contractAddr}`) {
      dispatch(updateCurrentPath(`contract/${contractAddr}`));
      navigate("/");
      console.log("GO.");
    }

    handleClose();
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    if (!textarea || !overlay) return;

    const handleScroll = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    (!whitelistEnabled ||
      whitelist.includes(userAddr) ||
      userAddr === owner) && (
      <>
        <Modal
          placement="bottom"
          show={show}
          onHide={handleClose}
          trigger={
            <span className="addMemoirButton" onClick={() => setShow(true)}>
              📝
            </span>
          }
        >
          <span>Title:</span>
          <input
            placeholder=""
            value={anthologyTitle}
            maxLength={50}
            style={{ backgroundColor: "white", color: "black" }}
            onChange={(e) => {
              setAnthologyTitle(e.target.value);
            }}
          ></input>
          <br />
          <span>Content:</span>
          <div style={{ position: "relative", width: "100%" }}>
            {/* Overlay with highlighted diffs */}
            <div
              ref={overlayRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                height: "10.5rem",
                overflowY: "auto", // Force scroll to match textarea behavior
                pointerEvents: "none",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "transparent",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                lineHeight: "1.5",
                letterSpacing: "normal",
                padding: "0.5rem",
                boxSizing: "border-box",
              }}
              aria-hidden="true"
            >
              {HighlightDifferences(anthologyContent, filteredContent)}
            </div>

            {/* Underlying textarea */}
            <textarea
              ref={textareaRef}
              value={shouldFilterTracking ? filteredContent : anthologyContent}
              maxLength={255}
              onChange={(e) => setAnthologyContent(e.target.value)}
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                height: "10.5rem",
                overflowY: shouldFilterTracking ? "scroll" : "auto",
                resize: "none",
                padding: "0.5rem",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                lineHeight: "1.5",
                letterSpacing: "normal",
                color: "black",
                backgroundColor: "transparent",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              type="checkbox"
              checked={shouldFilterTracking}
              onChange={() => setShouldFilterTracking(!shouldFilterTracking)}
            ></input>
            <span
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => setShouldFilterTracking(!shouldFilterTracking)}
            >
              Remove Tracking from URL
            </span>
          </div>

          <button style={{ marginTop: "15px" }} onClick={handleAddMemoir}>
            Add Memoir
          </button>
        </Modal>
      </>
    )
  );
};
