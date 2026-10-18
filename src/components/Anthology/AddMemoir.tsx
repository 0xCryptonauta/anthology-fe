import { useEffect, useMemo, useRef, useState, useId } from "react";
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
import {
  memoirHasUrl,
  normalizeUrlForComparison,
} from "@src/utils/memoirDuplicates";
import { extractFirstUrl } from "@src/utils/embeds";
import { fetchUrlTitle } from "@src/utils/fetchUrlTitle";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { HighlightDifferences } from "../Layout/HighlightDifferences";
import { Modal } from "../Layout/Modal";
import { useTranslation } from "@src/i18n/useTranslation";

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
  const { t } = useTranslation();
  const [anthologyTitle, setAnthologyTitle] = useState(title);
  const [anthologyContent, setAnthologyContent] = useState(content);
  const [shouldFilterTracking, setShouldFilterTracking] = useState(true);
  const [show, setShow] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [urlWarning, setUrlWarning] = useState("");
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const handleClose = () => setShow(false);

  // WCAG 3.3.2 / 4.1.2 — explicit label/form connections.
  const titleInputId = useId();
  const contentInputId = useId();
  const titleErrorId = useId();
  const urlErrorId = useId();
  const urlWarningId = useId();

  const { userAddr, currentPath } = useAppSelector((state) => state.user);
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.anthology[contractAddr]?.anthologyState || ""
  );
  const whitelist = useAppSelector(
    (state) => state.anthology[contractAddr]?.whitelist
  );
  const localAnthologies = useAppSelector((s) => s.localAnthology.anthologies);
  const onchainAnthologies = useAppSelector((s) => s.anthology);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const filteredContent = useMemo(() => {
    return shouldFilterTracking
      ? removeSocialTracking(anthologyContent)
      : anthologyContent;
  }, [shouldFilterTracking, anthologyContent]);

  useEffect(() => {
    const currentMemoirs = isLocalAnthology(contractAddr)
      ? localAnthologies[contractAddr] || []
      : onchainAnthologies[contractAddr]?.memoirs || [];

    const trimmedTitle = anthologyTitle.trim();
    const duplicateTitle =
      trimmedTitle.length > 0 &&
      currentMemoirs.some(
        (m) => m.title.trim().toLowerCase() === trimmedTitle.toLowerCase()
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

    const inCurrent = currentMemoirs.some((m) =>
      memoirHasUrl(m, normalizedUrl)
    );
    setUrlError(inCurrent ? t("memoir.duplicateUrlErr") : "");

    if (inCurrent) {
      setUrlWarning("");
      return;
    }

    const otherLists: MemoirInterface[][] = [];
    Object.entries(localAnthologies).forEach(([addr, memoirs]) => {
      if (addr !== contractAddr) otherLists.push(memoirs);
    });
    Object.entries(onchainAnthologies).forEach(([addr, data]) => {
      if (addr !== contractAddr) otherLists.push(data.memoirs || []);
    });

    const inOther = otherLists.some((memoirs) =>
      memoirs.some((m) => memoirHasUrl(m, normalizedUrl))
    );
    setUrlWarning(inOther ? t("memoir.urlInOtherWarning") : "");
  }, [
    anthologyTitle,
    filteredContent,
    localAnthologies,
    onchainAnthologies,
    contractAddr,
    t,
  ]);

  const handleAddMemoir = async () => {
    if (titleError || urlError) {
      addToast({
        title: t("memoir.cannotAdd"),
        content: titleError || urlError,
        variant: "info",
      });
      return;
    }

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
        title: t("memoir.added"),
        content: t("memoir.addedLocalDesc"),
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
          title: t("memoir.added"),
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
          <button
            type="button"
            className="addMemoirButton"
            aria-label={t("a11y.addMemoir")}
            style={{
              fontSize: "2.5rem",
              cursor: "pointer",
              padding: "0.25rem 0.75rem",
              background: "none",
              border: "none",
            }}
            onClick={() => setShow(true)}
          >
            📝
          </button>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              htmlFor={titleInputId}
              style={{ fontWeight: 500, fontSize: "1.2rem" }}
            >
              {t("memoir.title")}
            </label>
            {extractFirstUrl(filteredContent) && (
              <button
                type="button"
                disabled={isFetchingTitle}
                onClick={async () => {
                  setIsFetchingTitle(true);
                  const fetched = await fetchUrlTitle(filteredContent);
                  setIsFetchingTitle(false);
                  if (fetched) {
                    setAnthologyTitle(fetched);
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
            id={titleInputId}
            value={anthologyTitle}
            maxLength={50}
            placeholder={t("memoir.enterTitle")}
            aria-invalid={!!titleError}
            aria-describedby={titleError ? titleErrorId : undefined}
            onChange={(e) => setAnthologyTitle(e.target.value)}
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
              id={titleErrorId}
              role="alert"
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

          <label
            htmlFor={contentInputId}
            style={{ fontWeight: 500, fontSize: "1.2rem" }}
          >
            {t("memoir.content")}
          </label>
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
              {HighlightDifferences(anthologyContent, filteredContent)}
            </div>

            <textarea
              ref={textareaRef}
              id={contentInputId}
              value={anthologyContent}
              aria-invalid={!!urlError}
              aria-describedby={
                urlError ? urlErrorId : urlWarning ? urlWarningId : undefined
              }
              onChange={(e) => setAnthologyContent(e.target.value)}
              maxLength={255}
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
              id={urlErrorId}
              role="alert"
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
              id={urlWarningId}
              role="status"
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

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={shouldFilterTracking}
              onChange={() => setShouldFilterTracking(!shouldFilterTracking)}
            />
            <span style={{ userSelect: "none" }}>
              {t("memoir.removeTracking")}
            </span>
          </label>

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
            {t("memoir.addMemoir")}
          </button>
        </div>
      </Modal>
    )
  );
};
