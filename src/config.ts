import { http, createConfig } from "@wagmi/core";
import {
  //mainnet,
  optimism,
  localhost,
} from "@wagmi/core/chains";
import { injected, walletConnect } from "@wagmi/connectors";

const optimism2 = {
  ...optimism,
  rpcUrls: {
    default: {
      /* http: [
        import.meta.env.VITE_LAVA_OPTIMISM_RPC,
      ], */
      http: [String(import.meta.env.VITE_ALCHEMY_OPTIMISM_RPC)],
    },
  },
};

// 1. Your Reown Cloud project ID
const projectId = import.meta.env.VITE_PROJECT_ID;

// 2. Create wagmiConfig
const metadata = {
  name: "Anthology",
  description: "Collective memory",
  url: "https://memory.inbytes.xyz",
  icons: ["/IB_icon.png"],
};

export const config = createConfig({
  chains: [optimism2, localhost],
  connectors: [
    injected(),
    walletConnect({
      projectId: projectId,
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

    [optimism2.id]: http(),
    [localhost.id]: http(),
  },
});
