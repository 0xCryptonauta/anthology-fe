import { getAccount, reconnect } from "@wagmi/core";
import { config } from "./config";
import { ContractState } from "./components/ContractState";
import { useEffect, useState } from "react";
import { WalletConnector } from "./components/WalletConnector";
import { OnlyOwner } from "./components/OnlyOwner";

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
        flexDirection: "row",
        border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <h1>Anthology Factory DApp</h1>
      <WalletConnector />
      <ContractState />
      {address && <OnlyOwner />}
    </div>
  );
};

export default App;
