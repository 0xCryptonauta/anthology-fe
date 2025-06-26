import { OrderType } from "@src/components/Layout/OrderSelector";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { orderMemoirIndexes } from "@src/utils/orderMemoirs";
import { useMemo } from "react";

export const useOrderedMemoirs = (anthologyAddr: Address, order: OrderType) => {
  const memoirs = useAppSelector((state) =>
    isLocalAnthology(anthologyAddr)
      ? state.localAnthology.anthologies[anthologyAddr]
      : state.anthology[anthologyAddr].memoirs
  );

  const orderedMemoirsIndexes = useMemo(
    () =>
      orderMemoirIndexes({
        memoirs,
        order,
      }),
    [memoirs, order]
  );

  return { memoirs, orderedMemoirsIndexes };
};
