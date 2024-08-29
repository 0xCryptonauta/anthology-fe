import { getAccount, getConnectors, disconnect, Connector } from "@wagmi/core";

import { config } from "../config";
import { useEffect, useState } from "react";

function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

export const WalletConnector = () => {
  const [address, setAddress] = useState("");
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [currentWalletIcon, setCurrentWalletIcon] = useState("");

  useEffect(() => {
    const currentAccount = getAccount(config);
    const connectors = getConnectors(config);
    console.log("account:", currentAccount);
    //connectors = connectors.filter((conn) => conn.id !== "injected");

    const getConnectorById = (id: string) => {
      return connectors?.find((conn) => conn.id === id);
    };
    const currentConnector = getConnectorById(
      currentAccount.connector?.id ?? ""
    );
    setCurrentWalletIcon(currentConnector?.icon as string);

    setAddress(currentAccount.address ?? "");
    setConnectors(connectors as Connector[]);
  }, []);

  return address ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid white",
        width: "fit-content",
        height: "30px",
        padding: "3px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <span>{shortenAddress(address)}</span>
      <img
        src={currentWalletIcon}
        width={25}
        height={25}
        style={{ marginLeft: "5px" }}
      ></img>
      <span
        style={{ marginLeft: "5px", cursor: "pointer" }}
        onClick={async () => {
          disconnect(config);
          setAddress("");
        }}
      >
        ❌
      </span>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        border: "1px solid white",
        width: "fit-content",
        height: "30px",
        padding: "3px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      {connectors.length > 0 ? (
        connectors?.map((connector, i) => (
          <div
            key={i}
            style={{
              margin: "3px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={async () => {
              const result = await connector.connect();
              setAddress(result.accounts[0]);
              const icon = connector.icon;
              setCurrentWalletIcon(icon as string);
            }}
          >
            <img src={connector.icon} height={25} width={25} />
          </div>
        ))
      ) : (
        <div>
          <span>Install any EVM wallet</span>
        </div>
      )}
    </div>
  );
};
