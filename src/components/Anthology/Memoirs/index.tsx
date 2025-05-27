import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
import { OrderType } from "../../Layout/OrderSelector";
import { SkinType } from "@src/types/common";
import { useEffect } from "react";
import { MemoirRenderer } from "./MemoirRenderer";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
interface MemoirsProps {
  contractAddr: `0x${string}`;
  skin: SkinType;
  order: OrderType;
}

export const Memoirs: React.FC<MemoirsProps> = ({
  contractAddr,
  skin,
  order,
}) => {
  const anthology = useAppSelector((state) =>
    contractAddr.length !== 22 ? state.anthology[contractAddr] : undefined
  );

  const localAnthology = useAppSelector(
    (state) => state.localAnthology.anthologies[contractAddr]
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
      {anthology && !isLocalAnthology(contractAddr) && (
        <MemoirRenderer
          anthologySkin={skin}
          order={order}
          contractAddr={contractAddr}
          anthologyOwner={anthology.anthologyState.owner}
          memoirs={anthology.memoirs}
          currentUser={userAddr}
          dispatch={dispatch}
        />
      )}
      {isLocalAnthology(contractAddr) && (
        <MemoirRenderer
          anthologySkin={skin}
          order={order}
          contractAddr={contractAddr}
          anthologyOwner={LOCAL_USER_ADDR}
          memoirs={localAnthology}
          currentUser={userAddr}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};
