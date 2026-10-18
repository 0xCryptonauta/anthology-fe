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
import { fetchUrlTitle } from "@src/utils/fetchUrlTitle";
import { HighlightDifferences } from "../Layout/HighlightDifferences";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";
import { useTranslation } from "@src/i18n/useTranslation";

export const EditMemoir = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(memoir.title);
  const [content, setContent] = useState(memoir.content);
  const [shouldFilterTracking, setShouldFilterTracking] = useState(true);
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlWarning, setUrlWarning] = useState("");
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);

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
      duplicateTitle ? t("memoir.duplicateTitleErr") : ""
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
    setUrlError(inCurrent ? t("memoir.duplicateUrlErr") : "");

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
    setUrlWarning(inOther ? t("memoir.urlInOtherWarning") : "");
  }, [
    show,
    title,
    filteredContent,
    localAnthologies,
    onchainAnthologies,
    anthologyAddr,
    index,
    t,
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
        title: t("memoir.cannotSave"),
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
      title: t("memoir.updated"),
      content: t("memoir.updatedDesc"),
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
          title={t("memoir.editTitle")}
          style={{ cursor: "pointer", fontSize: "1rem" }}
          onClick={handleOpen}
        >
          <img
            src="/icons/edit-icon.svg"
            alt={t("memoir.editTitle")}
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
        <h4 style={{ textAlign: "center", margin: 0 }}>{t("memoir.editTitle")}</h4>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label style={{ fontWeight: 500, fontSize: "1.2rem" }}>{t("memoir.title")}</label>
          {extractFirstUrl(filteredContent) && (
            <button
              type="button"
              disabled={isFetchingTitle}
              onClick={async () => {
                setIsFetchingTitle(true);
                const fetched = await fetchUrlTitle(filteredContent);
                setIsFetchingTitle(false);
                if (fetched) {
                  setTitle(fetched);
                } else {
                  addToast({
                    title: t("memoir.titleNotFound"),
                    content: t("memoir.titleNotFoundDesc"),
                    variant: "info",
                  });
                }
              }}
              style={{
                background: "none",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                padding: "2px 8px",
                fontSize: "0.75rem",
                color: "#0891b2",
                fontWeight: 500,
                cursor: isFetchingTitle ? "wait" : "pointer",
              }}
            >
              {isFetchingTitle ? t("memoir.fetching") : t("memoir.autoFill")}
            </button>
          )}
        </div>
        <input
          value={title}
          maxLength={50}
          placeholder={t("memoir.enterTitle")}
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

        <label style={{ fontWeight: 500, fontSize: "1.2rem" }}>{t("memoir.content")}</label>
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
            {t("memoir.removeTracking")}
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
          {t("memoir.saveChanges")}
        </button>
      </div>
    </Modal>
  );
};
