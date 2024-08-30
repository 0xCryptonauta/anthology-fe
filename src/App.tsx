import { ContractState } from "./components/ContractState";
import { WalletConnector } from "./components/WalletConnector";
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
        flexDirection: "column",
        border: "1px solid white",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <div
        style={{
          border: "1px solid white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <div style={{ marginLeft: "7px" }}>
          <h1>Anthology Factory DApp</h1>
        </div>
        <WalletConnector />
      </div>

      <div style={{ display: "flex" }}>
        <MainComponent />
        <ContractState />
        {factoryOwner == userAddr && <OnlyOwner />}
      </div>
    </div>
  );
};

export default App;
