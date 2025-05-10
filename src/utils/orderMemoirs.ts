import { OrderType } from "@src/components/Anthology/Memoirs/OrderSelector";
import { MemoirInterface } from "@src/store/slices/anthologySlice";

export const orderMemoirs = ({
  memoirs,
  order,
}: {
  memoirs: MemoirInterface[];
  order: OrderType;
}) => {
  try {
    const memoirsCopy = [...memoirs];

    switch (order) {
      case "Newer":
        return memoirsCopy.sort(
          (a, b) => Number(b.timestamp) - Number(a.timestamp)
        );
      case "Older":
        return memoirsCopy.sort(
          (a, b) => Number(a.timestamp) - Number(b.timestamp)
        );
      case "Random":
        return memoirsCopy.sort(() => Math.random() - 0.5);
      case "A -> Z":
        return memoirsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case "Z -> A":
        return memoirsCopy.sort((a, b) => b.title.localeCompare(a.title));
      default:
        throw new Error(`Unsupported skin type: ${order}`);
        return memoirsCopy;
    }
  } catch (error) {
    console.error("Error ordering memoirs:", error);
    return memoirs;
  }
};
