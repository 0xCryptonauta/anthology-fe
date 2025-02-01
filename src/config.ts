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
      http: [
        "https://mainnet.optimism.io",
        "https://g.w.lavanet.xyz:443/gateway/optm/rpc-http/3dc655f970c930f1d3e78ee71beece18",
      ],
    },
  },
};

// 1. Your Reown Cloud project ID
const wcProjectId = import.meta.env.VITE_WC_PROJECT_ID;

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

    [optimism2.id]: http(),
    [localhost.id]: http(),
  },
});
