import { useState } from "react";
import { useConnect } from "wagmi";
import type { CreateConnectorFn } from "wagmi";
import { WALLETCONNECT_PARAMETERS } from "@src/wagmiConfig";
import { classifyWalletConnectError } from "@src/utils/walletConnectError";
import { useToast } from "@components/Layout/Toast";
import { useTranslation } from "@src/i18n/useTranslation";

const TOAST_DELAY_MS = 3000;

/**
 * The only trigger that loads wallet code. The WalletConnect vendor chunk is
 * kept out of the service-worker precache, so the dynamic import below can
 * fail offline — that failure is classified and explained to the user
 * instead of leaving a silently dead button.
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

    let connector: CreateConnectorFn;
    try {
      const { walletConnect } = await import("@src/connectors/walletConnect");
      connector = walletConnect(WALLETCONNECT_PARAMETERS);
    } catch (error) {
      setConnecting(false);
      // The vendor chunk is not precached: offline it cannot be downloaded.
      const kind = classifyWalletConnectError(error);
      if (kind === "offline") {
        addToast({
          title: t("wallet.offlineConnect"),
          content: t("wallet.offlineConnectDesc"),
          variant: "warning",
          delay: TOAST_DELAY_MS,
        });
      } else {
        addToast({
          title: t("wallet.connectFailed"),
          content: t("wallet.connectFailedDesc"),
          variant: "danger",
          delay: TOAST_DELAY_MS,
        });
      }
      return;
    }

    try {
      await connectAsync({ connector });
    } catch (error) {
      // The user closing the pairing modal is not worth reporting.
      if (classifyWalletConnectError(error) === "rejected") return;
      addToast({
        title: t("wallet.connectFailed"),
        content: t("wallet.connectFailedDesc"),
        variant: "danger",
        delay: TOAST_DELAY_MS,
      });
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
        aria-label="WalletConnect"
        title="WalletConnect"
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
