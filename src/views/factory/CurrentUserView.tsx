import { UserContracts, Contract } from "@components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { ActiveView } from "@src/types/common";

interface CurrentUserViewProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const CurrentUserView: React.FC<CurrentUserViewProps> = ({
  setActiveView,
}) => {
  const { userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const { userAddr } = useAppSelector((state) => state.user);

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
        //width: "100%",
        height: "100svh",
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
        userAddr={userAddr}
        userTitles={userTitles}
      />
    </div>
  );
};
