import type { CSSProperties } from "react";

/**
 * Shared layout for the reading pages (/about and /privacy) so navigating
 * between them does not change the panel width, background or top alignment.
 */
export const readingPageStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  minHeight: "50vh",
  padding: "2rem 1rem",
  gap: "1.5rem",
};

export const readingPanelStyle: CSSProperties = {
  width: "100%",
  maxWidth: "720px",
  backgroundColor: "rgba(255, 255, 255, 1)",
  borderRadius: "12px",
  padding: "24px",
  boxSizing: "border-box",
  color: "#1a1a1a",
};
