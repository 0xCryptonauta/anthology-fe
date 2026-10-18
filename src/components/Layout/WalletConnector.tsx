import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { shortenAddress } from "@src/utils/shortenAddress";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { resetUserStore, updateUserAddr } from "@src/store/slices/userSlice";
import { WalletOptions } from "./WalletOptions";
import { useTranslation } from "@src/i18n/useTranslation";

export const WalletConnector = () => {
  const { t } = useTranslation();
  const { userAddr } = useAppSelector((state) => state.user);
  const { disconnect } = useDisconnect({
    mutation: {
      onSuccess: () => {
        console.log("Disconnected successfully");
        dispatch(resetUserStore());
      },
    },
  });
  const dispatch = useAppDispatch();

  const { address, isConnected, connector } = useAccount();

  const handleDisconnect = () => {
    //dispatch(resetUserStore());
    disconnect();
    console.log("disconnected");
  };

  useEffect(() => {
    if (isConnected && address && address !== userAddr) {
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
      <span style={{ margin: "0px 10px" }}>{shortenAddress(userAddr)}</span>
      <img
        //src={"./icons/WalletConnectIcon.svg"}
        src={
          connector?.icon ? connector?.icon : "./icons/WalletConnectIcon.svg"
        }
        alt={connector?.name + " icon"}
        width={25}
        height={25}
        style={{ marginLeft: "5px", margin: "0px 5px" }}
      ></img>
      <span
        style={{ marginLeft: "5px", cursor: "pointer", margin: "0px 5px" }}
        onClick={() => handleDisconnect()}
      >
        <img
          src="/icons/delete-icon.svg"
          alt={t("wallet.disconnect")}
          style={{
            width: "16px",
            height: "16px",
            display: "block",
            filter: "invert(1)",
          }}
        />
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
        //margin: "5px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <WalletOptions />
      </div>
    </div>
  );
};
