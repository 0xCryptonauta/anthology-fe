import { store } from "@src/store/redux";
import { Config, CreateConnectorFn } from "wagmi";
import { createWagmiConfig } from "@src/wagmiConfig";

const chainiRpc = import.meta.env.VITE_FACTORY_RPC;

export const getCurrentConfig = (walletConnectConnector?: CreateConnectorFn) => {
  const state = store.getState();
  const factoryRpc = state.dapp.factoryRpc;

  const newConfig = createWagmiConfig(
    factoryRpc || chainiRpc,
    walletConnectConnector
  );

  return newConfig as Config;
};
