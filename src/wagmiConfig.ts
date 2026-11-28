import {
  Config,
  CreateConnectorFn,
  createConfig,
  createStorage,
  http,
  injected,
} from "wagmi";
import type { WalletConnectParameters } from "@wagmi/connectors";
import { arbitrum } from "viem/chains";
import memoize from "lodash.memoize";

const chainRpc =
  import.meta.env.VITE_FACTORY_RPC || arbitrum.rpcUrls.default.http[0];

// Match the page's real origin so WalletConnect's pairing screen and Verify
// check agree with the deployment (production: memory.inbytes.xyz, dev:
// memoria.inbytes.xyz). The fallback keeps Bun-side imports deterministic.
const metadataUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://memory.inbytes.xyz";

const metadata = {
  name: "Anthology",
  description: "Collective memory",
  url: metadataUrl,
  // WalletConnect metadata requires absolute icon URLs — wallets may not
  // resolve relative paths, and an unverified/unreadable icon shows up as a
  // blank dapp card in the pairing screen.
  icons: [`${metadataUrl}/IB_icon.png`],
};

const arbitrumCustom = {
  ...arbitrum,
  rpcUrls: {
    default: {
      http: [chainRpc],
    },
  },
};

export const networks = [arbitrumCustom];

/**
 * Shared WalletConnect options. Kept in this module (which has no static
 * `@wagmi/connectors` import) so callers can lazily load the connector with
 * `await import("@src/connectors/walletConnect")` without pulling it into the
 * initial bundle.
 *
 * `showQrModal: true` uses the modal bundled inside the provider (no extra
 * bytes): with a stored session the connector silently re-enables it, and
 * without one the pairing modal (QR on desktop, wallet deep links on
 * mobile) opens for a fresh connection.
 */
export const WALLETCONNECT_PARAMETERS: WalletConnectParameters = {
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  isNewChainsStale: false,
  showQrModal: true,
  qrModalOptions: {
    themeMode: "dark",
  },
  metadata,
};

export const createWagmiConfig = memoize(
  (rpcUrl: string, walletConnectConnector?: CreateConnectorFn) => {
    const finalRpc = rpcUrl ? rpcUrl : chainRpc;

    const chain = {
      ...arbitrum,
      rpcUrls: {
        default: {
          http: [finalRpc],
        },
      },
    };

    return createConfig({
      chains: [chain],
      storage: createStorage({ storage: window.localStorage }),
      connectors: [
        injected(),
        ...(walletConnectConnector ? [walletConnectConnector] : []),
      ],
      transports: {
        [chain.id]: http(finalRpc),
      },
    }) as Config;
  },
  (rpcUrl: string, walletConnectConnector?: CreateConnectorFn) =>
    walletConnectConnector ? `${rpcUrl}|walletConnect` : rpcUrl
);
