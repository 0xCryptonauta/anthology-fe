import { OrderType } from "@src/components/Layout/OrderSelector";
import { removeOneFromMemoirs } from "@src/store/slices/anthologySlice";
import { Address, SkinType } from "@src/types/common";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { useToast } from "@src/components/Layout/Toast";
import {
  MediaMemoirSkin,
  JsonMemoirSkin,
  TextMemoirSkin,
  ListMemoirSkin,
  PlaylistMemoirSkin,
} from "./memoirSkins";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { deleteMemoirFromUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";

interface RenderMemoirsProps {
  order: OrderType;
  anthologyAddr: Address;
  skin: SkinType;
}

export const MemoirRenderer: React.FC<RenderMemoirsProps> = ({
  order,
  anthologyAddr,
  skin,
}) => {
  const dispatch = useAppDispatch();

  const { addToast } = useToast();

  const memoirs = useAppSelector((state) =>
    isLocalAnthology(anthologyAddr)
      ? state.localAnthology.anthologies[anthologyAddr]
      : state.anthology[anthologyAddr].memoirs
  );

  const handleDelete = async ({
    anthologyAddr,
    index,
  }: {
    anthologyAddr: Address;
    index: number;
  }) => {
    if (isLocalAnthology(anthologyAddr)) {
      try {
        dispatch(
          deleteMemoirFromUserLocalAnthology({
            contract: anthologyAddr,
            memoir: memoirs[index],
          })
        );
        addToast({
          title: "Memoir deleted",
          content: "From local storage",
          variant: "success",
        });
      } catch (error) {
        console.log("Error deleting memoir from local anthology:", error);
        addToast({
          title: "Error deleting memoir",
          content: "Error deleting memoir",
          variant: "danger",
        });
      }
    } else {
      try {
        const txHash = await writeAnthology(anthologyAddr, "deleteMemoir", [
          index,
        ]);
        console.log("Deleting TxHash:", txHash);
        dispatch(
          removeOneFromMemoirs({
            contract: anthologyAddr,
            memoirIndex: index,
          })
        );
        if (txHash) {
          addToast({
            title: "Memoir deleted",
            content: "TxHash: " + txHash,
            variant: "danger",
          });
        }
      } catch (error) {
        console.error("Error deleting memoir:", error);
        addToast({
          title: "Error deleting memoir",
          content: "Error deleting memoir",
          variant: "danger",
        });
      }
    }
  };

  try {
    switch (skin) {
      case "json":
        return <JsonMemoirSkin anthologyAddr={anthologyAddr} order={order} />;
      case "media":
        return (
          <MediaMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            handleDelete={handleDelete}
          />
        );
      case "text":
        return (
          <TextMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            handleDelete={handleDelete}
          />
        );
      case "list":
        return (
          <ListMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            handleDelete={handleDelete}
          />
        );

      case "playlist":
        return (
          <PlaylistMemoirSkin anthologyAddr={anthologyAddr} order={order} />
        );
      default:
        return (
          <MediaMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            handleDelete={handleDelete}
          />
        );
    }
  } catch (error) {
    console.error("Error rendering RenderMemoirs:", error);
    return <div>Error rendering RenderMemoirs</div>;
  }
};
