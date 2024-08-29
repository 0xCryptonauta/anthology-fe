import { getAccount, reconnect } from "@wagmi/core";
import { config } from "./config";
import { ContractState } from "./components/ContractState";
import { useEffect, useState } from "react";
import { WalletConnector } from "./components/WalletConnector";
import { OnlyOwner } from "./components/OnlyOwner";
import { MainComponent } from "./components/MainComponent";

const App = () => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const reconnectWallet = async () => {
      const recWallets = await reconnect(config);
      console.log("reconnected wallet:", recWallets);
    };

    reconnectWallet();

    const account = getAccount(config);
    setAddress(account.address ?? "");
  }, []);

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
        {address && <OnlyOwner />}
      </div>
    </div>
  );
};

export default App;
