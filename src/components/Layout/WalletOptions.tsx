import { walletConnect } from "@wagmi/connectors";
import { useConnect } from "wagmi";

export const WalletOptions = () => {
  const { connectors, connect } = useConnect();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {connectors.map((connector, i) => {
        if (connector.name === "Injected") {
          return null;
        }
        if (connector.name === "WalletConnect") {
          return (
            <div
              key={i}
              style={{
                margin: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={async () => {
                const currentUser = connect({
                  connector: walletConnect({
                    projectId: import.meta.env.VITE_WC_PROJECT_ID,
                  }),
                });

                console.log("res2:", currentUser);
              }}
            >
              <img src={"icons/WalletConnectIcon.svg"} height={25} width={25} />
            </div>
          );
        }
        return (
          <div
            key={i}
            style={{
              margin: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={async () => {
              const currentUser = connect({
                connector: { ...connector, shimDisconnect: true },
              });

              console.log("res2:", currentUser);
            }}
          >
            <img
              src={
                connector?.icon
                  ? connector?.icon
                  : "icons/WalletConnectIcon.svg"
              }
              height={25}
              width={25}
            />
          </div>
        );
      })}
    </div>
  );
};
