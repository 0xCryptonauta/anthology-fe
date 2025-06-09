import { orderMemoirs } from "@src/utils/orderMemoirs";
import { OrderType } from "@src/components/Layout/OrderSelector";
import {
  MemoirInterface,
  removeOneFromMemoirs,
} from "@src/store/slices/anthologySlice";
import { AppDispatch } from "@src/store/redux";
import { SkinType } from "@src/types/common";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { ToastVariantType } from "@src/components/Layout/Toast";
import {
  MediaMemoirSkin,
  JsonMemoirSkin,
  TextMemoirSkin,
  ListMemoirSkin,
  PlaylistMemoirSkin,
} from "./memoirSkins";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { deleteMemoirFromUserLocalAnthology } from "@src/store/slices/localAnthologySlice";

interface RenderMemoirsProps {
  anthologySkin: SkinType;
  order: OrderType;
  anthologyOwner: `0x${string}`;
  memoirs: MemoirInterface[];
  contractAddr: `0x${string}`;
  currentUser: `0x${string}` | "";
  dispatch: AppDispatch;
}

export const MemoirRenderer: React.FC<RenderMemoirsProps> = ({
  anthologySkin,
  order,
  anthologyOwner,
  memoirs,
  contractAddr,
  currentUser,
  dispatch,
}) => {
  const orderedMemoirs = orderMemoirs({
    memoirs,
    order,
  });

  const handleDelete = async ({
    contractAddr,
    index,
    dispatch,
    addToast,
  }: {
    contractAddr: `0x${string}`;
    index: number;
    dispatch: AppDispatch;
    addToast: ({
      title,
      content,
      variant,
    }: {
      title: string;
      content: string;
      variant: ToastVariantType;
    }) => void;
  }) => {
    if (isLocalAnthology(contractAddr)) {
      try {
        dispatch(
          deleteMemoirFromUserLocalAnthology({
            contract: contractAddr,
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
        const txHash = await writeAnthology(contractAddr, "deleteMemoir", [
          index,
        ]);
        console.log("Deleting TxHash:", txHash);
        dispatch(
          removeOneFromMemoirs({
            contract: contractAddr,
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
    switch (anthologySkin) {
      case "json":
        return <JsonMemoirSkin memoirs={memoirs} />; //RenderJsonMemoirs({ memoirs });
      case "media":
        return (
          <MediaMemoirSkin
            contractAddr={contractAddr}
            anthologyOwner={anthologyOwner}
            memoirs={memoirs}
            orderMap={orderedMemoirs.map((_, i) => i)}
            currentUser={currentUser}
            dispatch={dispatch}
            handleDelete={handleDelete}
          />
        );
      case "text":
        return (
          <TextMemoirSkin
            contractAddr={contractAddr}
            anthologyOwner={anthologyOwner}
            memoirs={orderedMemoirs}
            currentUser={currentUser}
            dispatch={dispatch}
            handleDelete={handleDelete}
          />
        );
      case "list":
        return <ListMemoirSkin memoirs={orderedMemoirs} />;

      case "playlist":
        return <PlaylistMemoirSkin memoirs={orderedMemoirs} />;
      default:
        return (
          <MediaMemoirSkin
            contractAddr={contractAddr}
            anthologyOwner={anthologyOwner}
            memoirs={memoirs}
            orderMap={orderedMemoirs.map((_, i) => i)}
            currentUser={currentUser}
            dispatch={dispatch}
            handleDelete={handleDelete}
          />
        );
      //throw new Error(`Unsupported skin type: ${memoirSkin}`);
    }
  } catch (error) {
    console.error("Error rendering RenderMemoirs:", error);
    return <div>Error rendering RenderMemoirs</div>;
  }
};
