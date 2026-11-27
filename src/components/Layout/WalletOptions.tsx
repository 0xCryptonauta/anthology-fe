import { useState } from "react";
import { useConnect } from "wagmi";
import type { Connector, CreateConnectorFn } from "wagmi";
import { WALLETCONNECT_PARAMETERS } from "@src/wagmiConfig";
import {
  classifyWalletConnectError,
  type WalletConnectErrorKind,
} from "@src/utils/walletConnectError";
import { selectBrowserWalletConnectors } from "@src/utils/browserWallets";
import { useIsMobileViewport } from "@src/hooks/useIsMobileViewport";
import { useToast } from "@components/Layout/Toast";
import { useTranslation } from "@src/i18n/useTranslation";

const TOAST_DELAY_MS = 3000;
const WALLETCONNECT_CONNECTING_ID = "walletConnect";

type WindowWithEthereum = Window & { ethereum?: unknown };

const hasLegacyInjectedProvider = () =>
  typeof window !== "undefined" &&
  Boolean((window as WindowWithEthereum).ethereum);

/**
 * WalletConnect is the only control that downloads wallet code. Desktop also
 * shows up to five detected injected wallets, which connect directly through
 * wagmi. Mobile deliberately exposes WalletConnect only.
 *
 * With a stored WalletConnect session the connector silently re-enables it;
 * without one the provider's bundled pairing modal opens (QR on desktop,
 * wallet deep links on mobile).
 */
export const WalletOptions = () => {
  const { connectAsync, connectors } = useConnect();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const isMobile = useIsMobileViewport();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const connecting = connectingId !== null;

  const browserWallets = selectBrowserWalletConnectors(connectors, {
    isMobile,
    hasLegacyProvider: hasLegacyInjectedProvider(),
  });

  const report = (kind: WalletConnectErrorKind) => {
    // The user closing the pairing modal is not worth reporting.
    if (kind === "rejected") return;
    const offline = kind === "offline";
    addToast({
      title: t(offline ? "wallet.offlineConnect" : "wallet.connectFailed"),
      content: t(
        offline ? "wallet.offlineConnectDesc" : "wallet.connectFailedDesc"
      ),
      variant: offline ? "warning" : "danger",
      delay: TOAST_DELAY_MS,
    });
  };

  const handleInjectedConnect = async (connector: Connector) => {
    if (connecting) return;
    setConnectingId(connector.uid);

    try {
      await connectAsync({ connector });
    } catch (error) {
      report(classifyWalletConnectError(error));
    } finally {
      setConnectingId(null);
    }
  };

  const handleWalletConnect = async () => {
    if (connecting) return;
    setConnectingId(WALLETCONNECT_CONNECTING_ID);

    let connector: CreateConnectorFn;
    try {
      const { walletConnect } = await import("@src/connectors/walletConnect");
      connector = walletConnect(WALLETCONNECT_PARAMETERS);
    } catch (error) {
      report(classifyWalletConnectError(error));
      setConnectingId(null);
      return;
    }

    try {
      await connectAsync({ connector });
    } catch (error) {
      // The connector fetches the vendor chunk from inside connectAsync, so
      // an unloadable vendor lands here too — classify before reporting.
      report(classifyWalletConnectError(error));
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      aria-busy={connecting}
    >
      <span className="visually-hidden" role="status">
        {connecting ? t("wallet.connecting") : ""}
      </span>

      {browserWallets.map((connector) => {
        const label =
          connector.id === "injected"
            ? t("wallet.browser")
            : connector.name || t("wallet.browser");

        return (
          <button
            key={connector.uid}
            type="button"
            className="icon-button"
            aria-label={label}
            title={label}
            aria-disabled={connecting}
            style={{
              margin: "5px",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => handleInjectedConnect(connector)}
          >
            {connector.icon ? (
              <img
                src={connector.icon}
                width={25}
                height={25}
                alt=""
                style={{ width: "25px", height: "25px" }}
              />
            ) : (
              <span aria-hidden="true" style={{ fontSize: "11px" }}>
                {label}
              </span>
            )}
          </button>
        );
      })}

      <button
        type="button"
        className="icon-button"
        aria-label={t("wallet.walletConnect")}
        title={t("wallet.walletConnect")}
        aria-disabled={connecting}
        style={{
          margin: "5px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={handleWalletConnect}
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
