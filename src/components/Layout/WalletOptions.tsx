import { walletConnect } from "@wagmi/connectors";
import { useConnect } from "wagmi";
import { useTranslation } from "@src/i18n/useTranslation";

export const WalletOptions = () => {
  const { t } = useTranslation();
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
            <button
              key={i}
              type="button"
              className="icon-button"
              aria-label={connector.name}
              style={{
                margin: "5px",
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
              <img
                src={"icons/WalletConnectIcon.svg"}
                height={25}
                width={25}
                alt=""
              />
            </button>
          );
        }
        return (
          <button
            key={i}
            type="button"
            className="icon-button"
            aria-label={connector.name || t("a11y.connectorLogo")}
            style={{
              margin: "5px",
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
              alt=""
            />
          </button>
        );
      })}
    </div>
  );
};
