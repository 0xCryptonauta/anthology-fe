import { OrderType } from "@src/components/Layout/OrderSelector";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { orderMemoirIndexes } from "@src/utils/orderMemoirs";
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
        memoir.title.toLowerCase().includes(term) ||
        memoir.content.toLowerCase().includes(term)
      );
    });
  }, [memoirs, order, search]);

  return { memoirs, orderedMemoirsIndexes };
};
