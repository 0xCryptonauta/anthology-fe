import { useConnect } from "wagmi";
import { WALLETCONNECT_PARAMETERS } from "@src/wagmiConfig";

export const WalletOptions = () => {
  const { connect } = useConnect();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        className="icon-button"
        aria-label="WalletConnect"
        title="WalletConnect"
        style={{
          margin: "5px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={async () => {
          const { walletConnect } = await import(
            "@src/connectors/walletConnect"
          );
          connect({ connector: walletConnect(WALLETCONNECT_PARAMETERS) });
        }}
      >
        <img
          src="/icons/WalletConnectIcon.svg"
          width={25}
          height={25}
          alt=""
          style={{ width: "25px", height: "25px" }}
        />
      </button>
    </div>
  );
};
