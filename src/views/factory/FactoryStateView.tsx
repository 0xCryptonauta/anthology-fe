import { useAppSelector } from "@store/utils/hooks";

import { ContractState } from "@components/Factory/ContractState";
import { OnlyOwner } from "@components/Factory/OnlyOwner";

export const FactoryStateView = () => {
  const userAddr = useAppSelector((state) => state.user.userAddr);
  const factoryOwner = useAppSelector((state) => state.factory.owner);
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      {factoryOwner == userAddr && <OnlyOwner />}
      <ContractState />
    </div>
  );
};
