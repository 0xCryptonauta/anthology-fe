import {
  UserContracts,
  MemoirContent,
} from "@components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { ActiveView, Address } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";

interface LocalUserViewProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const LocalUserView: React.FC<LocalUserViewProps> = ({
  setActiveView,
}) => {
  const { userContracts, contractsTitles } = useAppSelector(
    (state) => state.localAnthology
  );

  const userTitles: MemoirContent[] =
    userContracts?.[LOCAL_USER_ADDR]?.map(
      (contractAddr: Address, index: number) => ({
        address: contractAddr,
        title: contractsTitles[contractAddr] || "",
        originalIndex: index,
      })
    ) || []; // Provide a default value if userTitles is undefined

  return (
    <div
      className="bg-dark"
      style={{
        //width: "100%",
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <UserContracts
        setActiveView={setActiveView}
        userAddr={LOCAL_USER_ADDR}
        userTitles={userTitles}
      />
    </div>
  );
};
