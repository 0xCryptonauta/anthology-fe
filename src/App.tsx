import { ContractState } from "./components/ContractState";
import { OnlyOwner } from "./components/OnlyOwner";
import { MainComponent } from "./components/MainComponent";

import { useSelector } from "react-redux";
import { RootState } from "./store";

const App = () => {
  const userAddr = useSelector((state: RootState) => state.user.userAddr);
  const factoryOwner = useSelector((state: RootState) => state.factory.owner);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        flexDirection: "row",
        padding: "7px",
        color: "white",
      }}
      className="bg-dark"
    >
      <MainComponent />
      <ContractState />
      {factoryOwner == userAddr && <OnlyOwner />}
    </div>
  );
};

export default App;
