import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
import { SkinType } from "@store/slices/anthologySlice";
import { OrderType } from "../../Layout/OrderSelector";
import { ActiveView } from "@src/types/common";
import { useEffect } from "react";
import { MemoirRenderer } from "./MemoirRenderer";
interface MemoirsProps {
  contractAddr: `0x${string}`;
  skin: SkinType;
  order: OrderType;
  setActiveView: (newActiveView: ActiveView) => void;
}

export const Memoirs: React.FC<MemoirsProps> = ({
  contractAddr,
  skin,
  order,
  setActiveView,
}) => {
  const anthology = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr] : undefined
  );
  const { userAddr } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        //border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "relative",
      }}
    >
      {anthology && (
        <MemoirRenderer
          anthologySkin={skin}
          order={order}
          contractAddr={contractAddr}
          anthologyOwner={anthology.anthologyState.owner}
          memoirs={anthology.memoirs}
          currentUser={userAddr}
          dispatch={dispatch}
          setActiveView={setActiveView}
        />
      )}
    </div>
  );
};
