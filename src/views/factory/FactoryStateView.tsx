import { useAppSelector } from "@store/utils/hooks";

import { ContractState } from "@components/Factory/ContractState";
import { OnlyOwner } from "@components/Factory/OnlyOwner";
import { useGetFactoryInfo } from "@src/hooks/useGetFactoryInfo";

export const FactoryStateView = () => {
  const userAddr = useAppSelector((state) => state.user.userAddr);
  const factoryOwner = useAppSelector((state) => state.factory.owner);

  useGetFactoryInfo(); // Fetch factory info on mount
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
