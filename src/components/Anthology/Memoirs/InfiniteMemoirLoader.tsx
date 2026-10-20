import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@src/i18n/useTranslation";
import { MEMOIRS_CHUNK_SIZE } from "@src/utils/constants";

interface InfiniteMemoirLoaderProps {
  hasMore: boolean;
  isPending: boolean;
  loadedCount: number;
  total: number;
  filterKey: string;
  onLoadMore: () => void;
}

/**
 * Sentinel + manual fallback for progressive memoir loading. The next chunk
 * loads automatically when the sentinel gets close to the viewport; the button
 * keeps the same action available to keyboard and assistive-technology users.
 */
export const InfiniteMemoirLoader = ({
  hasMore,
  isPending,
  loadedCount,
  total,
  filterKey,
  onLoadMore,
}: InfiniteMemoirLoaderProps) => {
  const { t } = useTranslation();

  // Prevent duplicate requests for the same window.
  const requestedRef = useRef("");
  const requestKey = `${filterKey}:${loadedCount}`;

  // The sentinel is re-keyed after every chunk so the observer measures its
  // new position below the freshly appended cards. Reacting to the observer
  // callback (instead of a state effect) avoids cascading through the whole
  // anthology before the browser has laid out the new chunk.
  const { ref } = useInView({
    rootMargin: "300px 0px",
    threshold: 0,
    onChange: (inView) => {
      if (!inView || !hasMore || isPending) return;
      if (requestedRef.current === requestKey) return;

      requestedRef.current = requestKey;
      onLoadMore();
    },
  });

  // Small anthologies don't need a loader or an "all loaded" message.
  if (total <= MEMOIRS_CHUNK_SIZE) return null;

  if (!hasMore) {
    return (
      <p
        role="status"
        aria-live="polite"
        style={{
          width: "100%",
          flexBasis: "100%",
          margin: "12px 0 20px",
          textAlign: "center",
          fontSize: "12px",
          color: "#a1a1aa",
        }}
      >
        {t("memoirs.allLoaded", { total })}
      </p>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        flexBasis: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "10px 0 20px",
      }}
    >
      <div
        key={requestKey}
        ref={ref}
        aria-hidden="true"
        style={{ width: "100%", height: "1px" }}
      />

      <button
        type="button"
        aria-disabled={isPending}
        onClick={() => {
          if (!isPending) onLoadMore();
        }}
        style={{
          minHeight: "36px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#e2e8f0",
          color: "#111",
          fontSize: "14px",
          fontWeight: 500,
          cursor: isPending ? "wait" : "pointer",
        }}
      >
        {isPending ? t("memoirs.loadingMore") : t("memoirs.loadMore")}
      </button>

      <span
        role="status"
        aria-live="polite"
        style={{ fontSize: "12px", color: "#a1a1aa" }}
      >
        {isPending
          ? t("memoirs.loadingMore")
          : t("memoirs.showingCount", { loaded: loadedCount, total })}
      </span>
    </div>
  );
};
