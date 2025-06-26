//import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
import { OrderType } from "../../Layout/OrderSelector";
import { useEffect } from "react";
import { MemoirRenderer } from "./MemoirRenderer";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { Loading } from "@src/components/Layout/Loading";
import { Address, SkinType } from "@src/types/common";

interface MemoirsProps {
  anthologyAddr: Address;
  order: OrderType;
  skin: SkinType;
}

export const Memoirs: React.FC<MemoirsProps> = ({
  anthologyAddr,
  order,
  skin,
}) => {
  const anthology = useAppSelector((state) =>
    !isLocalAnthology(anthologyAddr)
      ? state.anthology[anthologyAddr]
      : undefined
  );

  const localAnthology = useAppSelector(
    (state) => state.localAnthology.anthologies[anthologyAddr]
  );

  //const dispatch = useAppDispatch();

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
      {!anthology && !localAnthology && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Loading />
        </div>
      )}
      {anthology && !isLocalAnthology(anthologyAddr) && (
        <MemoirRenderer
          anthologyAddr={anthologyAddr}
          order={order}
          skin={skin}
        />
      )}
      {isLocalAnthology(anthologyAddr) && (
        <MemoirRenderer
          anthologyAddr={anthologyAddr}
          order={order}
          skin={skin}
        />
      )}
    </div>
  );
};
