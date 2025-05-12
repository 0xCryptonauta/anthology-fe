import { walletConnect, injected } from "@wagmi/connectors";
import { Config, createConfig, http } from "wagmi";
import { arbitrum } from "viem/chains";
import memoize from "lodash.memoize";

const wcProjectId = import.meta.env.VITE_WC_PROJECT_ID;
const chainRpc = "https://arbitrum.lava.build:443"; //import.meta.env.VITE_FACTORY_RPC;

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

export const createWagmiConfig = memoize((rpcUrl: string) => {
  const finalRpc = rpcUrl ? rpcUrl : chainRpc;

  console.log("used RPC", finalRpc.slice(0, 25) + "...");

  const arbitrumCustom = {
    ...arbitrum,
    rpcUrls: {
      default: {
        http: [finalRpc],
      },
    },
  };

  return createConfig({
    chains: [arbitrumCustom],
    connectors: [
      injected(),
      walletConnect({
        projectId: wcProjectId,
        isNewChainsStale: false,
        showQrModal: true,
        qrModalOptions: {
          themeMode: "dark",
        },
        metadata,
      }),
    ],
    transports: {
      [arbitrumCustom.id]: http(finalRpc),
    },
  }) as Config;
});

//export const config = createWagmiConfig(chainRpc);
