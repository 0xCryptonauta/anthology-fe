import { http, createConfig } from "@wagmi/core";
import {
  //mainnet,
  optimism,
  localhost,
  base,
  arbitrum,
  Chain,
} from "@wagmi/core/chains";
import { injected, walletConnect } from "@wagmi/connectors";

// 1. Your Reown Cloud project ID
const wcProjectId = import.meta.env.VITE_WC_PROJECT_ID;
const lavaProjectId = import.meta.env.VITE_LAVA_PROJECT_ID;

const createCustomChain = (
  chain: Chain,
  network: string,
  projectId: string
) => ({
  ...chain,
  rpcUrls: {
    default: {
      http: [
        `https://g.w.lavanet.xyz:443/gateway/${network}/rpc-http/${projectId}`,
      ],
    },
  },
});

const optimismCustom = createCustomChain(optimism, "optm", lavaProjectId);
const baseCustom = createCustomChain(base, "base", lavaProjectId);
const arbitrumCustom = createCustomChain(arbitrum, "arb1", lavaProjectId);

// 2. Create wagmiConfig
const metadata = {
  name: "Anthology",
  description: "Collective memory",
  url: "https://memory.inbytes.xyz",
  icons: ["/IB_icon.png"],
};

export const config = createConfig({
  chains: [optimismCustom, baseCustom, arbitrumCustom, localhost],
  connectors: [
    injected(),
    walletConnect({
      projectId: wcProjectId,
      isNewChainsStale: false,
      showQrModal: false,
      qrModalOptions: {
        themeMode: "dark",
      },
      metadata: metadata,
    }),
  ],
  transports: {
    //[mainnet.id]: http(),

    [optimismCustom.id]: http(),
    [baseCustom.id]: http(),
    [arbitrumCustom.id]: http(),
    [localhost.id]: http(),
  },
});
