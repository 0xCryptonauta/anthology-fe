import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { shortenAddress } from "@src/utils/shortenAddress";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { updateUserAddr } from "@src/store/slices/userSlice";
import { WalletOptions } from "./WalletOptions";

export const WalletConnector = () => {
  const { userAddr } = useAppSelector((state) => state.user);
  const { disconnect } = useDisconnect();
  const dispatch = useAppDispatch();

  const { address, isConnected } = useAccount();

  const handleDisconnect = () => {
    disconnect();
    dispatch(updateUserAddr(""));
  };

  /*   const { reconnect, connectors } = useReconnect();

  useEffect(() => {
    reconnect({ connectors });
  }, []); */

  useEffect(() => {
    if (isConnected && address && !userAddr) {
      dispatch(updateUserAddr(address));
      console.log("User address updated:", address);
    }
  }, [userAddr, address, isConnected, dispatch]);

  return isConnected ? (
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
        src={"./icons/WalletConnectIcon.svg"}
        width={25}
        height={25}
        style={{ marginLeft: "5px" }}
      ></img>
      <span
        style={{ marginLeft: "5px", cursor: "pointer" }}
        onClick={() => handleDisconnect()}
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <WalletOptions />
      </div>
    </div>
  );
};
