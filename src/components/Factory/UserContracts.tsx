import { useState, useMemo, useEffect, useRef, lazy, Suspense } from "react";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
import { Address, CurrentPaths, MemoirContent } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import { DeployButton } from "./DeployButton";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import "@src/styles/backgrounds.css";
import { getBgClass, hashString } from "@utils/backgrounds";
import { useTranslation } from "@src/i18n/useTranslation";

const MemoirSearchResults = lazy(() =>
  import("@src/components/Anthology/MemoirSearchResults").then((m) => ({
    default: m.MemoirSearchResults,
  }))
);

interface UserContractsProps {
  userAddr: Address;
  userTitles: MemoirContent[];
}

const CATEGORY_COLORS = [
  "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
  "border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
  "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
  "border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
  "border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
  "border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]",
  "border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
  "border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  "border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
  "border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
  "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  "border-lime-500/40 shadow-[0_0_15px_rgba(132,204,22,0.15)]",
  "border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]",
  "border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.15)]",
];

const getCategoryStyles = (category: string) =>
  CATEGORY_COLORS[hashString(category) % CATEGORY_COLORS.length];

// Scale the header font down for longer category names so they fit the 60px
// card unit without truncating with an ellipsis.
const getCategoryTitleSizeClass = (length: number): string => {
  if (length <= 14) return "text-lg";
  if (length <= 20) return "text-base";
  if (length <= 26) return "text-sm";
  return "text-xs";
};

/* ------------------------------- Card units ------------------------------- */
// One unopened card = exactly one grid row. Expanded cards snap their height
// to whole card units so their bottom edge lines up with the closed cards in
// the neighbouring columns, and `grid-auto-flow: dense` moves the cards below
// into the free slots beside them.
const CARD_ROW_PX = 60; // unopened card height (p-4 padding + header)
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
      style={{ gridRow: `span ${rowSpan}`, overflow: "hidden" }}
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
          indicatorClassName="shrink-0 text-xs text-zinc-300 font-mono tracking-wider px-2 py-1 rounded"
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
                    translate="no"
                    className="text-lg cursor-pointer text-white hover:text-white transition-colors bg-transparent border-none p-0 text-left"
                    onClick={() => handleOnClick(`contract/${address}`)}
                  >
                    &middot; {title}
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
                        translate="no"
                        className="text-lg cursor-pointer text-white hover:text-white transition-colors bg-transparent border-none p-0 text-left"
                        onClick={() => handleOnClick(`contract/${address}`)}
                      >
                        &middot; {title}
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
        indicatorClassName="shrink-0 text-xs text-zinc-300 font-mono bg-zinc-800/60 px-2 py-1 rounded"
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
                translate="no"
                className="text-sm cursor-pointer text-white hover:text-white transition-colors bg-transparent border-none p-0 text-left"
                onClick={() => handleOnClick(`contract/${address}`)}
              >
                &middot; {title.trim() ? title : shortenAddress(address, 12, 9)}
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
        <div className={`flex justify-between items-center mb-8 p-4 ${categoryBackgroundsEnabled && userAddr === LOCAL_USER_ADDR ? "bg-overlay bg-nested-triangles text-shadow-dark" : "bg-[#161b22]"} rounded-xl border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] mx-auto w-full max-w-2xl`}>
          <div className="flex items-center gap-4">
{/*             {userAddr === LOCAL_USER_ADDR && (
                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 select-none">
              PA
            </div>
              )} */}
            
            <div className="flex items-center gap-2">
              <h1 className="m-0 text-2xl font-medium leading-none">
                <button
                  type="button"
                  className="text-2xl font-medium hover:text-white transition-colors bg-transparent border-none text-zinc-100 p-0"
                  title={
                    userAddr !== LOCAL_USER_ADDR
                      ? t("a11y.syncAnthologies")
                      : undefined
                  }
                  aria-label={
                    userAddr !== LOCAL_USER_ADDR
                      ? `${shortenAddress(userAddr, 12, 9)} — ${t("a11y.syncAnthologies")}`
                      : undefined
                  }
                  onClick={() => {
                    if (userAddr === currentUserAddr) {
                      dispatch(syncUserContractsToStore(userAddr));
                    }
                  }}
                >
                  {userAddr === LOCAL_USER_ADDR ? t("nav.privateMemory") : shortenAddress(userAddr, 12, 9)}
                </button>
              </h1>
              {userAddr === LOCAL_USER_ADDR && (
                <span className="text-xs font-bold tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md select-none">
                  {t("directory.local")}
                </span>
              )}
            </div>
          </div>
          {(currentUserAddr === userAddr || userAddr === LOCAL_USER_ADDR) && (
            <DeployButton isLocal={userAddr === LOCAL_USER_ADDR} userTitles={userTitles} />
          )}
        </div>

        {userAddr === LOCAL_USER_ADDR && (
          <div className="w-full max-w-2xl mx-auto mb-6 relative">
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
        )}

        {search.trim() ? (
          <Suspense fallback={null}>
            <MemoirSearchResults term={search} />
          </Suspense>
        ) : (
        <div
          /* Unit grid: fixed 60px rows + dense flow. An expanded card spans
             whole card units, so its bottom edge aligns with the closed cards
             beside it and the cards below slide into the free slots. */
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-dense gap-4 w-full"
          style={{ gridAutoRows: `${CARD_ROW_PX}px` }}
        >
          {categoryCards}
        </div>
        )}
      </div>
    </div>
  );
};