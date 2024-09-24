import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia, optimism, localhost } from "@wagmi/core/chains";

/* export const hardhat = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://192.168.1.5:8545"],
    },
  },
}; */

const optimism2 = {
  ...optimism,
  rpcUrls: {
    default: {
      /* http: [
        "https://g.w.lavanet.xyz:443/gateway/optm/rpc-http/99f8d50396b4bf539a7b29e33ded4d41",
      ], */
      http: [
        "https://opt-mainnet.g.alchemy.com/v2/M7tALBsZlpuM79uTVhARMwLONb_Zf_bc",
      ],
    },
  },
};

export const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    optimism2,
    //hardhat,
    localhost,
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [localhost.id]: http(),
    //[hardhat.id]: http(),
  },
});
