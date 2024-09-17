import { reconnect } from "@wagmi/core";
import { readFactory } from "../components/ContractFunctions/FactoryFunctions";
import { config } from "../config";
import { readAnthology } from "../components/ContractFunctions/AnthologyFunctions";

export const fetchContractData = async () => {
  const contractInfo = (await readFactory("getContractInfo")) as {
    owner: string;
    isFrozen: boolean;
    whitelistEnabled: boolean;
    useErc20: boolean;
    erc20Token: string;
    anthologyPrice: number;
    userCount: number;
  };

  return {
    ...contractInfo,
    anthologyPrice: Number(contractInfo.anthologyPrice),
    userCount: Number(contractInfo.userCount),
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

export const fetchAnthologyInfo = async (contractAddr: string) => {
  const anthologyInfo = (await readAnthology(
    contractAddr,
    "getAnthologyInfo"
  )) as {
    owner: string;
    title: string;
    totalCreatedMemoirs: bigint;
    currentMemoirCount: number;
    maxMemoirs: number;
    memoirPrice: number;
    whitelistEnabled: boolean;
    //isFrozen: boolean;      // add
    useBuffer: boolean;
    useERC20: boolean;
    erc20Token: string;
    memoirsCP: number;
    memoirBufferCP: number;
    whitelistCP: number;
  };

  return {
    ...anthologyInfo,
    totalCreatedMemoirs: Number(anthologyInfo.totalCreatedMemoirs),
    currentMemoirCount: Number(anthologyInfo.currentMemoirCount),
    maxMemoirs: Number(anthologyInfo.maxMemoirs),
    memoirPrice: Number(anthologyInfo.memoirPrice),
    memoirsCP: Number(anthologyInfo.memoirsCP),
    memoirBufferCP: Number(anthologyInfo.memoirBufferCP),
    whitelistCP: Number(anthologyInfo.whitelistCP),
  };
};
