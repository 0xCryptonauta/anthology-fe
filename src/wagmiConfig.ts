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

const chainRpc = import.meta.env.VITE_FACTORY_RPC;

const metadataUrl = "https://memory.inbytes.xyz";

const metadata = {
  name: "Anthology",
  description: "Collective memory",
  url: metadataUrl,
  icons: ["/IB_icon.png"],
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
 */
export const WALLETCONNECT_PARAMETERS: WalletConnectParameters = {
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  isNewChainsStale: false,
  showQrModal: false,
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
