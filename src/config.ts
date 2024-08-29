import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia, localhost, hardhat } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat, localhost],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [localhost.id]: http(),
    [hardhat.id]: http(),
  },
});
