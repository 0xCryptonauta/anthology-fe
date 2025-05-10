import { walletConnect, injected } from "@wagmi/connectors";
import { createConfig, http } from "wagmi";
import { arbitrum } from "viem/chains";

const wcProjectId = import.meta.env.VITE_WC_PROJECT_ID;
const lavaId = import.meta.env.VITE_LAVA_PROJECT_ID;

const chainRpc = `https://g.w.lavanet.xyz:443/gateway/arb1/rpc-http/${lavaId}`;

const metadataUrl = "https://memory.inbytes.xyz";

const metadata = {
  name: "Anthology",
  description: "Collective memory",
  url: metadataUrl,
  icons: ["/IB_icon.png"],
};

const arbitrum_custom = {
  ...arbitrum,
  rpcUrls: {
    default: {
      http: [chainRpc],
    },
  },
};

export const networks = [arbitrum_custom];

export const config = createConfig({
  chains: [arbitrum],
  connectors: [
    injected(),
    walletConnect({
      projectId: wcProjectId,
      isNewChainsStale: false,
      showQrModal: true,
      qrModalOptions: {
        themeMode: "dark",
      },
      metadata: metadata,
    }),
  ],
  transports: {
    //[mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
});
