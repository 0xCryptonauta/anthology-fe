import { useMemo } from "react";
import { useAppDispatch } from "@src/store/utils/hooks";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import type { CurrentPaths, MemoirContent } from "@src/types/common";
import type { ConnectionAnthology } from "@src/utils/groupConnections";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import {
  getCategoryStyles,
  getCategoryTitleSizeClass,
} from "@src/utils/categoryStyles";
import { shortenAddress } from "@src/utils/shortenAddress";
import { useTranslation } from "@src/i18n/useTranslation";

export const UserConnectedMemory = ({
  anthologies,
}: {
  anthologies: ConnectionAnthology[];
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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
        className="flex w-full flex-wrap items-baseline justify-between gap-2 rounded-md px-1 py-0.5 text-left text-sm text-white transition-colors hover:bg-white/5"
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
      {Object.entries(categories).map(([category, data]) => (
        <section
          key={category}
          className={`rounded-xl border bg-[#0d1117] p-3 ${getCategoryStyles(
            category
          )}`}
        >
          <h3
            className={`m-0 font-bold tracking-wide text-white ${getCategoryTitleSizeClass(
              category.length
            )}`}
            translate="no"
          >
            {category}
          </h3>

          <ul className="mt-2 space-y-1">
            {data.items.map((item) => renderItem(item))}
          </ul>

          {Object.entries(data.subcategories).map(([sub, items]) => (
            <div
              key={sub}
              className="mt-2 border-t border-white/10 pt-2"
            >
              <h4
                className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-300"
                translate="no"
              >
                {sub}
              </h4>
              <ul className="space-y-1">{items.map((item) => renderItem(item))}</ul>
            </div>
          ))}
        </section>
      ))}

      {uncategorized.length > 0 && (
        <section className="rounded-xl border border-zinc-800 bg-[#0d1117] p-3">
          <h3 className="m-0 text-lg font-bold text-white">
            {t("common.other")}
          </h3>
          <ul className="mt-2 space-y-1">
            {uncategorized.map((item) => renderItem(item))}
          </ul>
        </section>
      )}
    </div>
  );
};
