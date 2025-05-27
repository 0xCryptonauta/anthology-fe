import { UserContracts } from "@src/components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";

interface Contract {
  address: Address;
  title: string;
  originalIndex: number;
}
interface UserViewProps {
  userAddr: Address;
}

export const UserView: React.FC<UserViewProps> = ({ userAddr }) => {
  const { userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

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
        //width: "100svh",
        color: "white",
        //border: "1px solid white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <UserContracts userAddr={userAddr} userTitles={userTitles} />
    </div>
  );
};
