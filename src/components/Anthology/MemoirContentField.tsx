import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { HighlightDifferences } from "../Layout/HighlightDifferences";

/**
 * The textarea and the highlight overlay must use **identical** text metrics.
 * If padding width, line-height or word-breaking drift apart, wrapped lines
 * land on different rows in each layer and the caret appears between the wrong
 * characters once the content is long enough to wrap.
 */
const sharedTextMetrics: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: "10.5rem",
  margin: 0,
  padding: "0.75rem",
  border: 0,
  fontFamily: "monospace",
  fontSize: "0.875rem",
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: "normal",
  tabSize: 4,
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  overflowY: "auto",
  overflowX: "hidden",
  // Reserve the same gutter in both layers even if a scrollbar is only
  // painted in one of them, so the wrapping width never changes.
  scrollbarGutter: "stable",
};

interface MemoirContentFieldProps {
  id: string;
  value: string;
  /** Content after tracking-param removal; differences render in red. */
  filteredValue: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}

export const MemoirContentField = ({
  id,
  value,
  filteredValue,
  onChange,
  invalid = false,
  describedBy,
}: MemoirContentFieldProps) => {
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
    <div
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#fff",
        border: invalid ? "1px solid #dc2626" : "1px solid #d1d5db",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          ...sharedTextMetrics,
          position: "absolute",
          inset: 0,
          color: "#111",
          pointerEvents: "none",
        }}
      >
        {HighlightDifferences(value, filteredValue)}
      </div>

      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        maxLength={255}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...sharedTextMetrics,
          position: "relative",
          zIndex: 1,
          resize: "none",
          backgroundColor: "transparent",
          color: "transparent",
          caretColor: "#111",
          outline: "none",
        }}
      />
    </div>
  );
};
