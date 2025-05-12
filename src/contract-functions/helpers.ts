import { store } from "@src/store/redux";
import { createWagmiConfig } from "@src/wagmiConfig";
import { Config } from "wagmi";

const chainiRpc = import.meta.env.VITE_FACTORY_RPC;

export const getCurrentConfig = () => {
  const state = store.getState();
  const factoryRpc = state.dapp.factoryRpc;

  if (!factoryRpc) {
    return createWagmiConfig(chainiRpc);
  }

  const newConfig = createWagmiConfig(factoryRpc);

  return newConfig as Config;
};
