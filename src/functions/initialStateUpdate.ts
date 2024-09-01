import { reconnect } from "@wagmi/core";
import { readFactory } from "../components/FactoryFunctions";
import { config } from "../config";

export const fetchContractData = async () => {
  const contractInfo = await readFactory("getContractInfo");

  const {
    isFrozen,
    whitelistEnabled,
    useErc20,
    erc20Token,
    anthologyPrice,
    userCount,
  } = contractInfo as {
    isFrozen: boolean;
    whitelistEnabled: boolean;
    useErc20: boolean;
    erc20Token: string;
    anthologyPrice: bigint;
    userCount: bigint;
  };
  const owner = await readFactory("owner");

  return {
    owner: owner as string,
    isFrozen,
    whitelistEnabled,
    useErc20,
    erc20Token,
    anthologyPrice: Number(anthologyPrice),
    userCount: Number(userCount),
  };
};

export const reconnectWallet = async () => {
  const recWallets = await reconnect(config);
  console.log("reconnected wallet:", recWallets);

  if (recWallets.length > 0) {
    return {
      currentAddr: recWallets[0].accounts[0],
      walletId: recWallets[0].connector.id,
    };
  }
};
