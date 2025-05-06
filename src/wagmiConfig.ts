import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_WC_PROJECT_ID;
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

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [arbitrum_custom],
  defaultNetwork: arbitrum,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: ["google"],
  },
  themeMode: "dark",
});
