import { useState } from "react";
import { useConnect } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
import { WALLETCONNECT_PARAMETERS } from "@src/wagmiConfig";
import {
  classifyWalletConnectError,
  type WalletConnectErrorKind,
} from "@src/utils/walletConnectError";
import { useToast } from "@components/Layout/Toast";
import { useTranslation } from "@src/i18n/useTranslation";

const TOAST_DELAY_MS = 3000;

/**
 * The only trigger that loads wallet code. Neither the connector shim nor
 * the WalletConnect vendor chunk is precached, so the dynamic imports on
 * this path can fail offline — failures are classified and explained to
 * the user instead of leaving a silently dead button.
 *
 * With a stored WalletConnect session the connector silently re-enables it;
 * without one the provider's bundled pairing modal opens (QR on desktop,
 * wallet deep links on mobile).
 */
export const WalletOptions = () => {
  const { connectAsync } = useConnect();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (connecting) return;
    setConnecting(true);

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

    let connector: CreateConnectorFn;
    try {
      const { walletConnect } = await import("@src/connectors/walletConnect");
      connector = walletConnect(WALLETCONNECT_PARAMETERS);
    } catch (error) {
      report(classifyWalletConnectError(error));
      setConnecting(false);
      return;
    }

    try {
      await connectAsync({ connector });
    } catch (error) {
      // The connector fetches the vendor chunk from inside connectAsync, so
      // an unloadable vendor lands here too — classify before reporting.
      report(classifyWalletConnectError(error));
    } finally {
      setConnecting(false);
    }
  };

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
        aria-label={t("wallet.connect")}
        title={t("wallet.connect")}
        disabled={connecting}
        style={{
          margin: "5px",
          display: "flex",
          alignItems: "center",
        }}
        onClick={handleConnect}
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
