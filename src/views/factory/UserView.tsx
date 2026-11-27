import { UserContracts } from "@src/components/Factory/UserContracts";
import { ContractsSyncMessage } from "@src/components/Factory/ContractsSyncMessage";
import { useAppSelector } from "@src/store/utils/hooks";
import { useSyncUserContracts } from "@src/hooks/useSyncUserContracts";
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
  const { status, reload } = useSyncUserContracts(userAddr);

  const userTitles: Contract[] = (userContracts[userAddr] ?? []).map(
    (contractAddr: Address, index: number) => ({
      address: contractAddr,
      title: contractsTitles[contractAddr] || "",
      originalIndex: index,
    })
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        color: "white",
      }}
    >
      <div style={{ padding: "8px", textAlign: "center" }}>
        <ContractsSyncMessage
          status={status}
          empty={userTitles.length === 0}
          reload={reload}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-around",
          flexWrap: "wrap",
          width: "100%",
          minWidth: 0,
        }}
      >
        <UserContracts userAddr={userAddr} userTitles={userTitles} />
      </div>
    </div>
  );
};
