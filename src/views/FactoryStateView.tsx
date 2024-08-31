import { useSelector } from "react-redux";
import { ContractState } from "../components/ContractState";
import { OnlyOwner } from "../components/OnlyOwner";
import { RootState } from "../store";

export const FactoryStateView = () => {
  const userAddr = useSelector((state: RootState) => state.user.userAddr);
  const factoryOwner = useSelector((state: RootState) => state.factory.owner);
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ContractState />
      {factoryOwner == userAddr && <OnlyOwner />}
    </div>
  );
};
