import { useSelector } from "react-redux";
import { ContractState } from "../../components/Factory/ContractState";
import { OnlyOwner } from "../../components/Factory/OnlyOwner";
import { RootState } from "../../store";

export const FactoryStateView = () => {
  const userAddr = useSelector((state: RootState) => state.user.userAddr);
  const factoryOwner = useSelector((state: RootState) => state.factory.owner);
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <ContractState />
      {factoryOwner == userAddr && <OnlyOwner />}
    </div>
  );
};
