import { useAppDispatch, useAppSelector } from "@store/utils/hooks";

import { useAppKit } from "@reown/appkit/react";
import { shortenAddress } from "@src/utils/shortenAddress";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { updateUserAddr } from "@src/store/slices/userSlice";

export const WalletConnector = () => {
  const { userAddr } = useAppSelector((state) => state.user);
  const { disconnect } = useDisconnect();
  const dispatch = useAppDispatch();
  const { open } = useAppKit();

  const { address, isConnected } = useAccount();

  const handleDisconnect = () => {
    disconnect();
    dispatch(updateUserAddr(""));
  };

  useEffect(() => {
    if (isConnected && address) {
      dispatch(updateUserAddr(address));
    }
  }, [address, isConnected, dispatch]);

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
        {!isConnected ? (
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px" }}
          >
            <img
              src="./icons/WalletConnectIcon.svg"
              width="30"
              height="30"
              alt="WalletConnect Logo"
              onClick={() => open()}
              style={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          <w3m-network-button />
        )}
      </div>
    </div>
  );
};
