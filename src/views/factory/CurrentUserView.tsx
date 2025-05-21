import { UserContracts } from "@components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { ActiveView, Address } from "@src/types/common";

interface Contract {
  address: Address;
  title: string;
  originalIndex: number;
}
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
    (contractAddr: Address, index: number) => ({
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
