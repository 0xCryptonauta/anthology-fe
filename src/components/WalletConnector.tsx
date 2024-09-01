import { getConnectors, disconnect } from "@wagmi/core";

import { config } from "../config";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { updateUserAddr, updateWalletId } from "../slices/userSlice";

function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
}

export const WalletConnector = () => {
  const { userAddr, walletId } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const connectors = getConnectors(config);
  const currentConnector = connectors?.find((conn) => conn.id === walletId);

  return userAddr ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        //border: "1px solid white",
        width: "fit-content",
        height: "30px",
        padding: "3px",
        borderRadius: "7px",
        margin: "5px",
        color: "white",
      }}
    >
      <span>{shortenAddress(userAddr)}</span>
      <img
        src={currentConnector?.icon}
        width={25}
        height={25}
        style={{ marginLeft: "5px" }}
      ></img>
      <span
        style={{ marginLeft: "5px", cursor: "pointer" }}
        onClick={async () => {
          disconnect(config);
          dispatch(updateUserAddr(""));
          dispatch(updateWalletId(""));
        }}
      >
        ❌
      </span>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        //border: "1px solid white",
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
              dispatch(updateUserAddr(result.accounts[0] as string));
              dispatch(updateWalletId(connector.id as string));
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
