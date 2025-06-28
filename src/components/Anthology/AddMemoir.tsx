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

// Imports remain the same

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
  const [shouldFilterTracking, setShouldFilterTracking] = useState(true);
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
            timestamp: String(Math.floor(Date.now() / 1000)),
          },
        })
      );
      setAnthologyTitle("");
      setAnthologyContent("");
      addToast({
        title: "Memoir Added",
        content: "Memoir added locally, not on blockchain yet",
        variant: "success",
        delay: 5000,
      });
    } else {
      const txHash = await writeAnthology(contractAddr, "createMemoir", [
        anthologyTitle,
        filteredContent,
      ]);
      if (txHash) {
        setAnthologyTitle("");
        setAnthologyContent("");
        addToast({
          title: "Memoir Added",
          content: "TxHash: " + txHash,
          variant: "success",
          delay: 5000,
        });
      }
    }

    if (currentPath !== `contract/${contractAddr}`) {
      dispatch(updateCurrentPath(`contract/${contractAddr}`));
    }
    navigate("/");
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
      <Modal
        placement="bottom"
        show={show}
        onHide={handleClose}
        trigger={
          <span
            className="addMemoirButton"
            style={{
              fontSize: "2.5rem",
              cursor: "pointer",
              padding: "0.25rem 0.75rem",
            }}
            onClick={() => setShow(true)}
          >
            📝
          </span>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ fontWeight: 500, fontSize: "1.2rem" }}>Title</label>
          <input
            value={anthologyTitle}
            maxLength={50}
            placeholder="Enter title"
            onChange={(e) => setAnthologyTitle(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              color: "#111",
              backgroundColor: "#fff",
              outline: "none",
            }}
          />

          <label style={{ fontWeight: 500, fontSize: "1.2rem" }}>Content</label>
          <div style={{ position: "relative", width: "100%" }}>
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
                overflowY: "auto",
                pointerEvents: "none",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "transparent",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                padding: "0.5rem",
              }}
              aria-hidden="true"
            >
              {HighlightDifferences(anthologyContent, filteredContent)}
            </div>

            <textarea
              ref={textareaRef}
              value={shouldFilterTracking ? filteredContent : anthologyContent}
              onChange={(e) => setAnthologyContent(e.target.value)}
              maxLength={255}
              style={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                height: "10.5rem",
                resize: "none",
                padding: "0.75rem",
                fontSize: "0.875rem",
                fontFamily: "monospace",
                backgroundColor: "#fff",
                color: "#111",
                border: "1px solid #d1d5db",
                borderRadius: "0.75rem",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={shouldFilterTracking}
              onChange={() => setShouldFilterTracking(!shouldFilterTracking)}
            />
            <span
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => setShouldFilterTracking(!shouldFilterTracking)}
            >
              Remove Tracking from URL
            </span>
          </div>

          <button
            onClick={handleAddMemoir}
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.95rem",
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            Add Memoir
          </button>
        </div>
      </Modal>
    )
  );
};
