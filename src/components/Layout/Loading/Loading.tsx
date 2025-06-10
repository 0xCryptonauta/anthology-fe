import "./styles.css";

export function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <div className="loading-text">Loading…</div>
    </div>
  );
}
