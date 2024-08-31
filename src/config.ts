import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia, localhost } from "@wagmi/core/chains";

export const hardhat = {
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
};

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat, localhost],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
    [hardhat.id]: http(),
  },
});
