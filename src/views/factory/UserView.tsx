import { UserContracts, Contract } from "@src/components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { ActiveView } from "@src/types/common";

interface UserViewProps {
  userAddr: string;
  setActiveView: (newActiveView: ActiveView) => void;
}

export const UserView: React.FC<UserViewProps> = ({
  setActiveView,
  userAddr,
}) => {
  const { userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const userTitles: Contract[] = userContracts[userAddr]?.map(
    (contractAddr: string, index: number) => ({
      address: contractAddr,
      title: contractsTitles[contractAddr] || "",
      originalIndex: index,
    })
  );

  return (
    <div
      className="bg-dark"
      style={{
        //width: "100svh",
        height: "100svh",
        color: "white",
        //border: "1px solid white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <UserContracts
        setActiveView={setActiveView}
        userAddr={userAddr}
        userTitles={userTitles}
      />
    </div>
  );
};
