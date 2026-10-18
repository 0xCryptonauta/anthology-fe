import { OrderType } from "@src/components/Layout/OrderSelector";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { orderMemoirIndexes } from "@src/utils/orderMemoirs";
import { matchesSearch } from "@src/utils/searchMatch";
import { useMemo } from "react";

export const useOrderedMemoirs = (
  anthologyAddr: Address,
  order: OrderType,
  search = ""
) => {
  const memoirs = useAppSelector((state) =>
    isLocalAnthology(anthologyAddr)
      ? state.localAnthology.anthologies[anthologyAddr]
      : state.anthology[anthologyAddr].memoirs
  );

  const orderedMemoirsIndexes = useMemo(() => {
    const ordered = orderMemoirIndexes({
      memoirs,
      order,
    });

    const term = search.trim().toLowerCase();
    if (!term || !memoirs) return ordered;

    return ordered.filter((i) => {
      const memoir = memoirs[i];
      if (!memoir) return false;
      return (
        matchesSearch(memoir.title, term) ||
        matchesSearch(memoir.content, term)
      );
    });
  }, [memoirs, order, search]);

  return { memoirs, orderedMemoirsIndexes };
};
