import { useId, useMemo, useState, type CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import type { CurrentPaths, MemoirContent } from "@src/types/common";
import type { ConnectionAnthology } from "@src/utils/groupConnections";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import {
  getCategoryStyles,
  getCategoryTitleSizeClass,
} from "@src/utils/categoryStyles";
import { getBgClass } from "@src/utils/backgrounds";
import { shortenAddress } from "@src/utils/shortenAddress";
import { useTranslation } from "@src/i18n/useTranslation";

const headerButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  background: "none",
  border: "none",
  padding: 0,
  color: "inherit",
  cursor: "pointer",
  textAlign: "left",
  font: "inherit",
};

const indicatorClassName = "text-xs font-mono text-zinc-400";

export const UserConnectedMemory = ({
  anthologies,
}: {
  anthologies: ConnectionAnthology[];
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categoryBackgroundsEnabled = useAppSelector(
    (state) => state.dapp.categoryBackgroundsEnabled
  );
  const baseId = useId();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Record<string, boolean>
  >({});

  const titles: MemoirContent[] = useMemo(
    () =>
      anthologies.map((anthology, index) => ({
        address: anthology.address,
        title: anthology.title,
        originalIndex: index,
      })),
    [anthologies]
  );

  const memoirCounts = useMemo(
    () =>
      Object.fromEntries(
        anthologies.map((anthology) => [
          anthology.address,
          anthology.memoirCount,
        ])
      ),
    [anthologies]
  );

  const { categories, uncategorized } = useMemo(
    () => parseContractsCategoriesSorted(titles),
    [titles]
  );

  const openAnthology = (address: string) => {
    const path = `contract/${address}` as CurrentPaths;
    dispatch(updateCurrentPath(path));
    window.history.pushState(
      { currentPath: path },
      "",
      window.location.pathname
    );
  };

  const memoirCountLabel = (count: number) =>
    count === 1
      ? t("connect.memoirCountOne")
      : t("connect.memoirCount", { count });

  const renderItem = ({ address, title }: MemoirContent) => (
    <li key={address}>
      <button
        type="button"
        onClick={() => openAnthology(address)}
        className="flex w-full flex-wrap items-baseline justify-between gap-2 rounded-md bg-transparent px-1 py-0.5 text-left text-sm text-white transition-colors hover:bg-white/5"
      >
        <span translate="no">
          {title.trim() ? title : shortenAddress(address, 12, 9)}
        </span>
        <span className="text-xs text-zinc-400">
          {memoirCountLabel(memoirCounts[address] ?? 0)}
        </span>
      </button>
    </li>
  );

  return (
    <div className="mt-3 space-y-3">
      {Object.entries(categories).map(([category, data], categoryIndex) => {
        const isExpanded = expandedCategories[category] ?? false;
        const contentId = `${baseId}-category-${categoryIndex}`;

        return (
          <section
            key={category}
            className={`rounded-xl border p-3 transition-all duration-200 ${
              categoryBackgroundsEnabled
                ? `${getBgClass(category)} text-shadow-dark`
                : "bg-[#0d1117]"
            } ${getCategoryStyles(category)}`}
          >
            <h3
              className={`m-0 font-bold tracking-wide text-white ${getCategoryTitleSizeClass(
                category.length
              )}`}
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={() =>
                  setExpandedCategories((previous) => ({
                    ...previous,
                    [category]: !isExpanded,
                  }))
                }
                style={headerButtonStyle}
              >
                <span translate="no">{category}</span>
                <span aria-hidden="true" className={indicatorClassName}>
                  {isExpanded ? "[-]" : "[+]"}
                </span>
              </button>
            </h3>

            <div id={contentId} hidden={!isExpanded}>
              {data.items.length > 0 && (
                <ul className="mt-2 ml-4 space-y-1">
                  {data.items.map((item) => renderItem(item))}
                </ul>
              )}

              {Object.entries(data.subcategories).map(([sub, items], subIndex) => {
                const subKey = `${category}::${sub}`;
                const subExpanded = expandedSubcategories[subKey] ?? false;
                const subContentId = `${baseId}-subcategory-${categoryIndex}-${subIndex}`;

                return (
                  <div key={sub} className="mt-2 ml-4 border-t border-white/10 pt-2">
                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                      <button
                        type="button"
                        aria-expanded={subExpanded}
                        aria-controls={subContentId}
                        onClick={() =>
                          setExpandedSubcategories((previous) => ({
                            ...previous,
                            [subKey]: !subExpanded,
                          }))
                        }
                        style={headerButtonStyle}
                      >
                        <span translate="no">{sub}</span>
                        <span aria-hidden="true" className={indicatorClassName}>
                          {subExpanded ? "[-]" : "[+]"}
                        </span>
                      </button>
                    </h4>

                    <div id={subContentId} hidden={!subExpanded}>
                      <ul className="ml-4 space-y-1">
                        {items.map((item) => renderItem(item))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {uncategorized.length > 0 && (
        <section
          className={`rounded-xl border border-zinc-800 p-3 transition-all duration-200 ${
            categoryBackgroundsEnabled
              ? `${getBgClass("uncategorized")} text-shadow-dark`
              : "bg-[#0d1117]"
          }`}
        >
          <h3 className="m-0 text-lg font-bold text-white">
            <button
              type="button"
              aria-expanded={expandedCategories.__other__ ?? false}
              aria-controls={`${baseId}-other`}
              onClick={() =>
                setExpandedCategories((previous) => ({
                  ...previous,
                  __other__: !(previous.__other__ ?? false),
                }))
              }
              style={headerButtonStyle}
            >
              <span>{t("common.other")}</span>
              <span aria-hidden="true" className={indicatorClassName}>
                {expandedCategories.__other__ ? "[-]" : "[+]"}
              </span>
            </button>
          </h3>

          <div id={`${baseId}-other`} hidden={!(expandedCategories.__other__ ?? false)}>
            <ul className="mt-2 ml-4 space-y-1">
              {uncategorized.map((item) => renderItem(item))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};
