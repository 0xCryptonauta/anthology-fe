import { useEffect, useMemo, useRef, useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { updateMemoirInUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { removeSocialTracking } from "@src/utils/removeSocialTracking";
import {
  memoirHasUrl,
  normalizeUrlForComparison,
} from "@src/utils/memoirDuplicates";
import { extractFirstUrl } from "@src/utils/embeds";
import { HighlightDifferences } from "../Layout/HighlightDifferences";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";

export const EditMemoir = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(memoir.title);
  const [content, setContent] = useState(memoir.content);
  const [shouldFilterTracking, setShouldFilterTracking] = useState(true);
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlWarning, setUrlWarning] = useState("");

  const localAnthologies = useAppSelector((s) => s.localAnthology.anthologies);
  const onchainAnthologies = useAppSelector((s) => s.anthology);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const filteredContent = useMemo(() => {
    return shouldFilterTracking ? removeSocialTracking(content) : content;
  }, [shouldFilterTracking, content]);

  const handleOpen = () => {
    setTitle(memoir.title);
    setContent(memoir.content);
    setTitleError("");
    setUrlError("");
    setUrlWarning("");
    setShow(true);
  };

  useEffect(() => {
    if (!show) return;

    const currentMemoirs = localAnthologies[anthologyAddr] || [];

    const trimmedTitle = title.trim();
    const duplicateTitle =
      trimmedTitle.length > 0 &&
      currentMemoirs.some(
        (m, i) =>
          i !== index &&
          m.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
      );
    setTitleError(
      duplicateTitle
        ? "A memoir with this title already exists in this anthology"
        : ""
    );

    const url = extractFirstUrl(filteredContent);
    const normalizedUrl = url ? normalizeUrlForComparison(url) : null;

    if (!normalizedUrl) {
      setUrlError("");
      setUrlWarning("");
      return;
    }

    const inCurrent = currentMemoirs.some(
      (m, i) => i !== index && memoirHasUrl(m, normalizedUrl)
    );
    setUrlError(inCurrent ? "This URL already exists in this anthology" : "");

    if (inCurrent) {
      setUrlWarning("");
      return;
    }

    const otherLists: MemoirInterface[][] = [];
    Object.entries(localAnthologies).forEach(([addr, memoirs]) => {
      if (addr !== anthologyAddr) otherLists.push(memoirs);
    });
    Object.entries(onchainAnthologies).forEach(([addr, data]) => {
      if (addr !== anthologyAddr) otherLists.push(data.memoirs || []);
    });

    const inOther = otherLists.some((memoirs) =>
      memoirs.some((m) => memoirHasUrl(m, normalizedUrl))
    );
    setUrlWarning(inOther ? "This URL exists in another anthology" : "");
  }, [
    show,
    title,
    filteredContent,
    localAnthologies,
    onchainAnthologies,
    anthologyAddr,
    index,
  ]);

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
  }, [show]);

  const handleSave = () => {
    if (titleError || urlError) {
      addToast({
        title: "Cannot save memoir",
        content: titleError || urlError,
        variant: "info",
      });
      return;
    }

    dispatch(
      updateMemoirInUserLocalAnthology({
        contract: anthologyAddr,
        index,
        title,
        content: filteredContent,
      })
    );
    addToast({
      title: "Memoir updated",
      content: "Your changes were saved locally",
      variant: "success",
      delay: 5000,
    });
    setShow(false);
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={() => setShow(false)}
      trigger={
        <span
          title="Edit memoir"
          style={{ cursor: "pointer", fontSize: "1rem" }}
          onClick={handleOpen}
        >
          <img
            src="/icons/edit-icon.svg"
            alt="Edit memoir"
            style={{ width: "18px", height: "18px", display: "block" }}
          />
        </span>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "260px",
          boxSizing: "border-box",
        }}
      >
        <h4 style={{ textAlign: "center", margin: 0 }}>Edit Memoir</h4>

        <label style={{ fontWeight: 500, fontSize: "1.2rem" }}>Title</label>
        <input
          value={title}
          maxLength={50}
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            border: titleError ? "1px solid #dc2626" : "1px solid #d1d5db",
            fontSize: "0.95rem",
            color: "#111",
            backgroundColor: "#fff",
            outline: "none",
          }}
        />
        {titleError && (
          <span
            style={{
              color: "#dc2626",
              fontSize: "0.8rem",
              display: "block",
              wordBreak: "break-word",
            }}
          >
            {titleError}
          </span>
        )}

        <label style={{ fontWeight: 500, fontSize: "1.2rem" }}>Content</label>
        <div
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#fff",
            border: urlError ? "1px solid #dc2626" : "1px solid #d1d5db",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <div
            ref={overlayRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              height: "10.5rem",
              overflowY: "auto",
              pointerEvents: "none",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#111",
              fontSize: "0.875rem",
              fontFamily: "monospace",
              padding: "0.75rem",
            }}
            aria-hidden="true"
          >
            {HighlightDifferences(content, filteredContent)}
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            maxLength={255}
            onChange={(e) => setContent(e.target.value)}
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              height: "10.5rem",
              resize: "none",
              padding: "0.75rem",
              fontSize: "0.875rem",
              fontFamily: "monospace",
              backgroundColor: "transparent",
              color: "transparent",
              caretColor: "#111",
              border: "none",
              borderRadius: "0.75rem",
              outline: "none",
            }}
          />
        </div>
        {urlError && (
          <span
            style={{
              color: "#dc2626",
              fontSize: "0.8rem",
              display: "block",
              wordBreak: "break-word",
            }}
          >
            {urlError}
          </span>
        )}
        {!urlError && urlWarning && (
          <span
            style={{
              color: "#b45309",
              fontSize: "0.8rem",
              display: "block",
              wordBreak: "break-word",
            }}
          >
            {urlWarning}
          </span>
        )}

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
          onClick={handleSave}
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
          }}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};
