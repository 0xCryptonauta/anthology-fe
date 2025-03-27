/* import { getConnectors, disconnect } from "@wagmi/core";

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
  console.log("CONNECTORS:", connectors);
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
}; */

import {
  getConnectors,
  disconnect,
  connect,
  getConnections,
} from "@wagmi/core";

import { config } from "../../config";

import {
  walletConnect,
  //injected
} from "@wagmi/connectors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/redux";
import { updateUserAddr, updateWalletId } from "../../store/slices/userSlice";

function shortenAddress(address: string) {
  return `${address?.substring(0, 6)}...${address?.substring(
    address?.length - 4
  )}`;
}

/* const reconnectWallet = async () => {
  const recWallets = await reconnect(config, {
    connectors: [
      injected({
        shimDisconnect: false,
      }),
      walletConnect({
        projectId: import.meta.env.VITE_WC_PROJECT_ID,
      }),
    ],
  });
  console.log("reconnected wallet:", recWallets);

  if (recWallets.length > 0) {
    return {
      currentAddr: recWallets[0].accounts[0],
      walletId: recWallets[0].connector.id,
    };
  }
}; */

export const WalletConnector = () => {
  const dispatch = useDispatch();
  const { userAddr, walletId } = useSelector((state: RootState) => state.user);
  //const [account, setAccount] = useState<Config>();
  //const [currentAddr, setCurrentAddr] = useState("");

  const connections = getConnections(config);
  console.log("connections:", connections);

  const connectors = getConnectors(config);

  //const currentWalletId = account?.connector?.id;

  const currentConnector = connectors?.find((conn) => conn.id === walletId);

  const filteredConnectors = connectors?.filter(
    (conn) => conn.id !== "injected" && conn.id !== "walletConnect"
  );

  console.log("filtered", filteredConnectors);
  console.log("Current conn:", currentConnector);

  const connectWalletConnect = async () => {
    const currentUser = await connect(config, {
      connector: walletConnect({
        projectId: import.meta.env.VITE_WC_PROJECT_ID,
      }),
    });
    console.log("Wallet result: ", currentUser);
    dispatch(updateUserAddr(currentUser.accounts[0] as string));
  };

  /*   useEffect(() => {
    const reconnectW = async () => {
      const walletInfo = await reconnectWallet();
      console.log("walletInfo", walletInfo);
      setAccount(getAccount(config));
      setCurrentAddr(walletInfo?.currentAddr);
    };
    reconnectW();
  }, []); */

  console.log("ACC:", userAddr);
  return userAddr ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        //border: "1px solid white",
        width: "fit-content",
        padding: "3px",
        borderRadius: "7px",
        margin: "5px",
        color: "white",
      }}
    >
      <span>{shortenAddress(userAddr)}</span>
      <img
        src={currentConnector?.icon || "./icons/WalletConnectIcon.svg"}
        width={25}
        height={25}
        style={{ marginLeft: "5px" }}
      ></img>
      <span
        style={{ marginLeft: "5px", cursor: "pointer" }}
        onClick={async () => {
          disconnect(config, {
            connector: connections[0].connector,
          });
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

        padding: "3px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      {filteredConnectors.length > 0 ? (
        <>
          {filteredConnectors?.map((connector, i) => (
            <div
              key={i}
              style={{
                margin: "3px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={async () => {
                /* onst currentUser = await connector.connect();
              console.log("result:", currentUser.accounts[0]);
              setAccount(currentUser.accounts[0]); */

                const currentUser = await connect(config, {
                  connector: { ...connector, shimDisconnect: false },
                });

                console.log("res2:", currentUser);

                dispatch(updateUserAddr(currentUser.accounts[0] as string));
                dispatch(updateWalletId(connector.id as string));
              }}
            >
              <img src={connector?.icon} height={25} width={25} />
            </div>
          ))}
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px" }}
          >
            <img
              src="./icons/WalletConnectIcon.svg"
              width="30"
              height="30"
              alt="Metamask Logo"
              onClick={() => connectWalletConnect()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </>
      ) : (
        <div>
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px" }}
          >
            <img
              src="./icons/WalletConnectIcon.svg"
              width="30"
              height="30"
              alt="Metamask Logo"
              onClick={() => connectWalletConnect()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
