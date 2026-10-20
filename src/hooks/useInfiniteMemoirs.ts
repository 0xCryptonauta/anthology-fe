import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { OrderType } from "@src/components/Layout/OrderSelector";
import { Address } from "@src/types/common";
import { MEMOIRS_CHUNK_SIZE } from "@src/utils/constants";
import { useOrderedMemoirs } from "./useOrderedMemoirs";

/**
 * Renders memoirs in progressive chunks instead of mounting the whole
 * anthology at once. Search and ordering still run over the full list; only
 * the visible window is sliced.
 */
export const useInfiniteMemoirs = (
  anthologyAddr: Address,
  order: OrderType,
  search = ""
) => {
  const { memoirs, orderedMemoirsIndexes } = useOrderedMemoirs(
    anthologyAddr,
    order,
    search
  );

  const total = orderedMemoirsIndexes.length;
  const filterKey = `${anthologyAddr}\u0000${order}\u0000${search}`;

  // The key makes the reset to the first chunk synchronous when the filter
  // changes, so the previous (possibly large) window is never re-rendered.
  const [windowState, setWindowState] = useState({
    key: filterKey,
    count: MEMOIRS_CHUNK_SIZE,
  });
  const [isPending, startTransition] = useTransition();

  const activeCount =
    windowState.key === filterKey ? windowState.count : MEMOIRS_CHUNK_SIZE;
  const visibleCount = Math.min(
    activeCount,
    Math.max(total, MEMOIRS_CHUNK_SIZE)
  );

  // Filter changes reset the window; total changes clamp it after deletes or
  // chain refreshes. The render-time derivation above keeps the interim frame
  // small, so this single effect never re-renders a large old window.
  useEffect(() => {
    setWindowState((prev) => {
      const count =
        prev.key === filterKey
          ? Math.min(prev.count, Math.max(total, MEMOIRS_CHUNK_SIZE))
          : MEMOIRS_CHUNK_SIZE;

      return prev.key === filterKey && prev.count === count
        ? prev
        : { key: filterKey, count };
    });
  }, [filterKey, total]);

  const visibleIndexes = useMemo(
    () => orderedMemoirsIndexes.slice(0, visibleCount),
    [orderedMemoirsIndexes, visibleCount]
  );

  const hasMore = visibleIndexes.length < total;

  const loadMore = useCallback(() => {
    if (isPending || !hasMore) return;

    startTransition(() => {
      setWindowState((prev) => {
        const base =
          prev.key === filterKey
            ? Math.min(prev.count, Math.max(total, MEMOIRS_CHUNK_SIZE))
            : MEMOIRS_CHUNK_SIZE;

        return {
          key: filterKey,
          count: Math.min(base + MEMOIRS_CHUNK_SIZE, total),
        };
      });
    });
  }, [filterKey, hasMore, isPending, total]);

  return {
    memoirs,
    visibleIndexes,
    total,
    loadedCount: visibleIndexes.length,
    hasMore,
    isPending,
    filterKey,
    loadMore,
  };
};
