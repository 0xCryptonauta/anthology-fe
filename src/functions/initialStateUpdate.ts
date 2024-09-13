import { reconnect } from "@wagmi/core";
import { readFactory } from "../components/ContractFunctions/FactoryFunctions";
import { config } from "../config";
import { readAnthology } from "../components/ContractFunctions/AnthologyFunctions";

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

export const fetchAnthologyInfo = async (contractAddr: string) => {
  const anthologyInfo = await readAnthology(contractAddr, "getAnthologyInfo");
  const {
    title,
    totalCreatedMemoirs,
    currentMemoirCount,
    maxMemoirs,
    memoirPrice,
    whitelistEnabled,
    //isFrozen,
    useBuffer,
    useERC20,
    erc20Token,
    memoirsCP,
    memoirBufferCP,
    whitelistCP,
  } = anthologyInfo as {
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
  const owner = await readAnthology(contractAddr, "owner");

  return {
    owner: owner as string,
    title,
    totalCreatedMemoirs: Number(totalCreatedMemoirs),
    currentMemoirCount: Number(currentMemoirCount),
    maxMemoirs: Number(maxMemoirs),
    memoirPrice: Number(memoirPrice),
    whitelistEnabled,
    //isFrozen,
    useBuffer,
    useERC20,
    erc20Token,
    memoirsCP: Number(memoirsCP),
    memoirBufferCP: Number(memoirBufferCP),
    whitelistCP: Number(whitelistCP),
  };
};
