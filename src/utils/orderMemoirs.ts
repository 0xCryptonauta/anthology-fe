import { OrderType } from "@src/components/Layout/OrderSelector";
import { MemoirInterface } from "@src/store/slices/anthologySlice";

export const orderMemoirIndexes = ({
  memoirs,
  order,
}: {
  memoirs: MemoirInterface[];
  order: OrderType;
}): number[] => {
  try {
    const indexes = memoirs.map((_, i) => i);

    switch (order) {
      case "Newer":
        return indexes.sort(
          (a, b) => Number(memoirs[b].timestamp) - Number(memoirs[a].timestamp)
        );
      case "Older":
        return indexes.sort(
          (a, b) => Number(memoirs[a].timestamp) - Number(memoirs[b].timestamp)
        );
      case "Random":
        return indexes.sort(() => Math.random() - 0.5);
      case "A -> Z":
        return indexes.sort((a, b) =>
          memoirs[a].title.localeCompare(memoirs[b].title)
        );
      case "Z -> A":
        return indexes.sort((a, b) =>
          memoirs[b].title.localeCompare(memoirs[a].title)
        );
      default:
        throw new Error(`Unsupported order type: ${order}`);
    }
  } catch (error) {
    console.error("Error ordering memoir indexes:", error);
    return memoirs.map((_, i) => i);
  }
};
