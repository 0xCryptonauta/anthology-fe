import {
  getAccount,
  getConnectors,
  disconnect,
  Connector,
  reconnect,
} from "@wagmi/core";

import { config } from "../config";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateUserAddr } from "../slices/userSlice";

function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

export const WalletConnector = () => {
  const userAddr = useSelector((state: RootState) => state.user.userAddr);
  const dispatch = useDispatch();

  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [currentWalletIcon, setCurrentWalletIcon] = useState("");

  useEffect(() => {
    const reconnectWallet = async () => {
      const connectors = getConnectors(config);
      setConnectors(connectors as Connector[]);

      const recWallets = await reconnect(config);
      console.log("reconnected wallet:", recWallets);
      if (recWallets.length > 0) {
        const currentAccount = getAccount(config);

        const getConnectorById = (id: string) => {
          return connectors?.find((conn) => conn.id === id);
        };
        const currentConnector = getConnectorById(
          currentAccount.connector?.id ?? ""
        );

        setCurrentWalletIcon(currentConnector?.icon as string);
        dispatch(updateUserAddr(currentAccount.address as string));
      }
    };

    reconnectWallet();
  }, [dispatch]);

  return userAddr ? (
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
      <span>{shortenAddress(userAddr)}</span>
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
          dispatch(updateUserAddr(""));
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
              //setAddress(result.accounts[0]);
              dispatch(updateUserAddr(result.accounts[0] as string));
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
