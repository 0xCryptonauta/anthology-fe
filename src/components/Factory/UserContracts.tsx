import { useState, useMemo, useEffect, useRef, lazy, Suspense } from "react";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { Address, CurrentPaths, MemoirContent } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import { DeployButton } from "./DeployButton";
import { DownloadReduxStore } from "@components/Layout/DownloadReduxStore";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import "@src/styles/backgrounds.css";
import { getBgClass } from "@utils/backgrounds";
import {
  getCategoryStyles,
  getCategoryTitleSizeClass,
} from "@src/utils/categoryStyles";
import { useTranslation } from "@src/i18n/useTranslation";
import { QrIcon } from "@components/Layout/QrIcon";

const MemoirSearchResults = lazy(() =>
  import("@src/components/Anthology/MemoirSearchResults").then((m) => ({
    default: m.MemoirSearchResults,
  }))
);

interface UserContractsProps {
  userAddr: Address;
  userTitles: MemoirContent[];
  memoirCounts?: Record<string, number>;
}

/* ------------------------------- Card units ------------------------------- */
// One unopened card = exactly one grid row. Expanded cards snap their height
// to whole card units so their bottom edge lines up with the closed cards in
// the neighbouring columns, and `grid-auto-flow: dense` moves the cards below
// into the free slots beside them.
const CARD_ROW_PX = 60; // unopened card height (p-4 padding + header)
const CARD_WIDTH_PX = 333;
const CARD_PADDING_PX = 32; // p-4 top + bottom
const CARD_GAP_PX = 16; // gap-4 between rows
const CARD_PITCH_PX = CARD_ROW_PX + CARD_GAP_PX;

interface CategoryCardProps {
  title: React.ReactNode;
  expanded: boolean;
  estimatedHeight?: number;
  onToggle: () => void;
  className: string;
  indicatorClassName: string;
  children: React.ReactNode;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  expanded,
  estimatedHeight = 80,
  onToggle,
  className,
  indicatorClassName,
  children,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(estimatedHeight);

  // Measure the card's natural content via ResizeObserver entries to avoid
  // synchronous scrollHeight forced reflows on mount.
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !expanded) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const h =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      if (h > 0) setContentHeight(Math.ceil(h));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  // N rows occupy N * pitch - gap px, and must fit the content plus padding.
  const totalHeight = contentHeight + CARD_PADDING_PX;
  const rowSpan = expanded
    ? Math.max(2, Math.ceil((totalHeight + CARD_GAP_PX) / CARD_PITCH_PX))
    : 1;

  return (
    <div
      className={`${className} ${expanded ? "" : "flex flex-col justify-center"}`}
      style={{ gridRow: `span ${rowSpan}`, overflow: "hidden", minWidth: 0 }}
    >
      <div ref={contentRef}>
        <button
          type="button"
          aria-expanded={expanded}
          className="flex justify-between items-center gap-2 cursor-pointer select-none w-full bg-transparent border-none p-0"
          onClick={onToggle}
        >
          {title}
          <span aria-hidden="true" className={indicatorClassName}>
            {expanded ? "[-]" : "[+]"}
          </span>
        </button>
        {expanded && children}
      </div>
    </div>
  );
};

export const UserContracts: React.FC<UserContractsProps> = ({
  userAddr,
  userTitles,
  memoirCounts,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentUserAddr = useAppSelector((state) => state.user.userAddr);
  const categoryBackgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);

  const [search, setSearch] = useState("");

  const EXPANDED_KEY = `anthology-expanded-${userAddr}`;
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(EXPANDED_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(EXPANDED_KEY, JSON.stringify(expandedCategories));
  }, [expandedCategories, EXPANDED_KEY]);

  const memoirCountLabel = (address: string): string | null => {
    const count = memoirCounts?.[address];
    if (count === undefined) return null;
    return count === 1
      ? t("connect.memoirCountOne")
      : t("connect.memoirCount", { count });
  };

  const handleOnClick = (newCurrentPath: CurrentPaths) => {
    dispatch(updateCurrentPath(newCurrentPath));
    window.history.pushState({ currentPath: newCurrentPath }, "", window.location.pathname);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const hasExpandedCategory = useMemo(
    () => Object.values(expandedCategories).some(Boolean),
    [expandedCategories]
  );

  const collapseAllCategories = () => {
    setExpandedCategories((previous) =>
      Object.values(previous).some(Boolean) ? {} : previous
    );
  };

  const processedData = useMemo(() => {
    const { categories, uncategorized } = parseContractsCategoriesSorted(userTitles);

    const sortedCategories = Object.entries(categories).map(([category, data]) => {
      return [
        category,
        {
          items: [...data.items].sort((a, b) => a.title.localeCompare(b.title)),
          subcategories: Object.entries(data.subcategories).reduce((acc, [sub, subItems]) => {
            acc[sub] = [...subItems].sort((a, b) => a.title.localeCompare(b.title));
            return acc;
          }, {} as { [subcategory: string]: MemoirContent[] }),
        },
      ] as const;
    });

    const sortedUncategorized = [...uncategorized].sort((a, b) => a.title.localeCompare(b.title));

    return { categories: sortedCategories, uncategorized: sortedUncategorized };
  }, [userTitles]);

  // One card per category, plus the "Other" card. Expanded cards snap to
  // whole card units (see CategoryCard) and `grid-auto-flow: dense` moves the
  // cards below into the free slots beside them.
  const categoryCards: React.ReactNode[] = processedData.categories.map(
    ([category, categoryData]) => {
      const { items, subcategories } = categoryData;
      const isExpanded = expandedCategories[category] || false;
      const neonStyles = getCategoryStyles(category);

      const subEntries = Object.entries(subcategories);
      const estimatedHeight =
        28 +
        16 +
        items.length * 36 +
        subEntries.reduce(
          (sum, [, subItems]) => sum + 56 + subItems.length * 34,
          0
        );

      return (
        <CategoryCard
          key={category}
          expanded={isExpanded}
          estimatedHeight={estimatedHeight}
          onToggle={() => toggleCategory(category)}
          className={`p-4 ${categoryBackgroundsEnabled ? `${getBgClass(category)} text-shadow-dark` : ""} rounded-xl transition-all duration-200 ${neonStyles}`}
          indicatorClassName="shrink-0 text-xs text-zinc-100 font-mono tracking-wider px-2 py-1 rounded"
          title={
            <h2
              className={`m-0 font-bold tracking-wide ${getCategoryTitleSizeClass(category.length)}`}
              translate="no"
            >
              {category}
            </h2>
          }
        >
          <div className="animate-fadeIn mt-4">
            <ul className="space-y-2 ml-2">
              {items.map(({ address, title }) => (
                <li key={address}>
                  <button
                    type="button"
                    className="inline-flex flex-wrap items-baseline gap-1 text-lg cursor-pointer text-white hover:text-white transition-colors bg-transparent border-none p-0 text-left wrap-anywhere min-w-0"
                    onClick={() => handleOnClick(`contract/${address}`)}
                  >
                    <span translate="no">&middot; {title}</span>
                    {memoirCountLabel(address) && (
                      <span className="text-xs text-zinc-400">
                        {memoirCountLabel(address)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {subEntries.map(([sub, subItems]) => (
              <div key={sub} className="mt-4 p-3 rounded-lg border-zinc-800">
                <h3 className="text-lg font-semibold text-white mb-2" translate="no">{sub}</h3>
                <ul className="space-y-1.5 ml-1">
                  {subItems.map(({ address, title }) => (
                    <li key={address}>
                      <button
                        type="button"
                        className="inline-flex flex-wrap items-baseline gap-1 text-lg cursor-pointer text-white hover:text-white transition-colors bg-transparent border-none p-0 text-left wrap-anywhere min-w-0"
                        onClick={() => handleOnClick(`contract/${address}`)}
                      >
                        <span translate="no">&middot; {title}</span>
                        {memoirCountLabel(address) && (
                          <span className="text-xs text-zinc-400">
                            {memoirCountLabel(address)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CategoryCard>
      );
    }
  );

  if (processedData.uncategorized.length > 0) {
    const isUncategorizedExpanded =
      expandedCategories["Uncategorized_General_Key"] || false;

    categoryCards.push(
      <CategoryCard
        key="uncategorized"
        expanded={isUncategorizedExpanded}
        estimatedHeight={44 + processedData.uncategorized.length * 28}
        onToggle={() => toggleCategory("Uncategorized_General_Key")}
        className={`p-4 ${categoryBackgroundsEnabled ? `${getBgClass("uncategorized")} text-shadow-dark` : ""} rounded-xl border-zinc-800`}
        indicatorClassName="shrink-0 text-xs text-zinc-100 font-mono bg-zinc-800/60 px-2 py-1 rounded"
        title={
          <h2 className="m-0 text-lg font-bold text-white">
            {t("common.other")}
          </h2>
        }
      >
        <ul className="space-y-2 ml-2 animate-fadeIn mt-4">
          {processedData.uncategorized.map(({ address, title }) => (
            <li key={address}>
              <button
                type="button"
                className="inline-flex flex-wrap items-baseline gap-1 text-sm cursor-pointer text-white hover:text-white transition-colors bg-transparent border-none p-0 text-left wrap-anywhere min-w-0"
                onClick={() => handleOnClick(`contract/${address}`)}
              >
                <span translate="no">
                  &middot; {title.trim() ? title : shortenAddress(address, 12, 9)}
                </span>
                {memoirCountLabel(address) && (
                  <span className="text-xs text-zinc-400">
                    {memoirCountLabel(address)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </CategoryCard>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-6 text-zinc-100 min-h-screen">
      <div className="w-full max-w-7xl">

        {/* --- HEADER DE USUARIO --- */}
        <div
          className={`flex flex-wrap justify-between items-center mb-8 gap-y-3 p-4 ${categoryBackgroundsEnabled && userAddr === LOCAL_USER_ADDR ? "bg-overlay bg-nested-triangles text-shadow-dark" : "bg-[#161b22]"} rounded-xl border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] mx-auto w-full`}
          style={{ maxWidth: `${CARD_WIDTH_PX}px` }}
        >
          <div className="flex items-center gap-4">
{/*             {userAddr === LOCAL_USER_ADDR && (
                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 select-none">
              PA
            </div>
              )} */}
            
            <div
              className="flex flex-wrap items-center"
              style={{ marginLeft: "-10px", gap: "4px" }}
            >
              {userAddr === LOCAL_USER_ADDR && (
                <DownloadReduxStore
                  mode="share"
                  trigger={
                    <button
                      type="button"
                      title={t("connect.shareQr")}
                      aria-label={t("connect.shareQr")}
                      style={{
                        width: "44px",
                        height: "44px",
                        padding: "4px",
                        border: "none",
                        borderRadius: "8px",
                        background: "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                    >
                      <QrIcon size={36} radius={4} />
                    </button>
                  }
                />
              )}
              {/* `text-2xl!` is required: the legacy unlayered
                  `h1 { font-size: 3.2em }` rule in index.css beats Tailwind's
                  layered utilities, which rendered this heading at 51px and
                  widened the whole page past phone viewports. `wrap-anywhere`
                  keeps long wallet addresses from forcing it wider still. */}
              <h1
                className="text-2xl! font-medium leading-none wrap-anywhere"
                style={{ margin: 0 }}
              >
                {userAddr === LOCAL_USER_ADDR
                  ? t("nav.privateMemory")
                  : shortenAddress(userAddr, 12, 9)}
              </h1>
            </div>
          </div>
          {(currentUserAddr === userAddr || userAddr === LOCAL_USER_ADDR) && (
            <DeployButton isLocal={userAddr === LOCAL_USER_ADDR} userTitles={userTitles} />
          )}
        </div>

        {userAddr === LOCAL_USER_ADDR && (
          <div
            className="w-full mx-auto mb-6 flex items-center gap-2"
            style={{ maxWidth: `${CARD_WIDTH_PX}px` }}
          >
            <div className="relative flex-1 min-w-0">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("directory.searchAll")}
                type="search"
                aria-label={t("a11y.searchMemoirs")}
                className="w-full px-4 py-2 pr-10 rounded-xl bg-[#161b22] border border-sky-500/40 text-zinc-100 placeholder-zinc-400 outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  style={{ padding: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-0 text-zinc-400 hover:text-zinc-100 text-sm leading-none cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={collapseAllCategories}
              disabled={!hasExpandedCategory}
              aria-label={t("directory.collapseAll")}
              title={t("directory.collapseAll")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-0 bg-[#161b22] border border-sky-500/40 text-zinc-100 transition-colors hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 14l5-5 5 5" />
                <path d="M7 20l5-5 5 5" />
              </svg>
            </button>
          </div>
        )}

        {search.trim() ? (
          <Suspense fallback={null}>
            <MemoirSearchResults term={search} />
          </Suspense>
        ) : (
        <div
          /* Fixed-width card units: every card is 333px wide (or the available
             width on very narrow phones, so nothing overflows horizontally),
             so a long anthology name can never widen it. `1fr` tracks used to
             resize the whole grid when content or scroll chrome changed. */
          className="grid grid-flow-dense gap-4 w-full"
          style={{
            gridTemplateColumns: `repeat(auto-fill, min(${CARD_WIDTH_PX}px, 100%))`,
            gridAutoRows: `${CARD_ROW_PX}px`,
            justifyContent: "center",
          }}
        >
          {categoryCards}
        </div>
        )}
      </div>
    </div>
  );
};