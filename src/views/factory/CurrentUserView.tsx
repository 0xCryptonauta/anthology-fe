import { UserContracts } from "@components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";

interface Contract {
  address: Address;
  title: string;
  originalIndex: number;
}

export const CurrentUserView = () => {
  const { userContracts, contractsTitles, whitelistedUsers } = useAppSelector(
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
      <UserContracts userAddr={userAddr} userTitles={userTitles} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {!userTitles?.[0] && <span>Anthologies not found</span>}
        {!whitelistedUsers.includes(userAddr) && (
          <span style={{ color: "Red" }}>
            Your are address is not whitelisted
          </span>
        )}
      </div>
    </div>
  );
};
