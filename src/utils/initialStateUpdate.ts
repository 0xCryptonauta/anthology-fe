import { reconnect } from "@wagmi/core";
import { readFactory } from "@contract-functions/FactoryFunctions";
import { config } from "@src/config";
import { readAnthology } from "@contract-functions/AnthologyFunctions";

export const fetchContractData = async () => {
  const contractInfo = (await readFactory("getContractInfo")) as {
    owner: string;
    isFrozen: boolean;
    whitelistEnabled: boolean;
    useErc20: boolean;
    erc20Token: string;
    anthologyPrice: number;
    userCount: number;
    usersCP: number;
  };

  return {
    ...contractInfo,
    anthologyPrice: Number(contractInfo.anthologyPrice),
    userCount: Number(contractInfo.userCount),
    usersCP: Number(contractInfo.usersCP),
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

function hexToString(hex: string) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

export const fetchAnthologyInfo = async (contractAddr: string) => {
  const anthologyInfo = (await readAnthology(
    contractAddr,
    "getAnthologyInfo"
  )) as {
    owner: string;
    title: string;
    skin: string;
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
    skin: hexToString(anthologyInfo.skin),
    totalCreatedMemoirs: Number(anthologyInfo.totalCreatedMemoirs),
    currentMemoirCount: Number(anthologyInfo.currentMemoirCount),
    maxMemoirs: Number(anthologyInfo.maxMemoirs),
    memoirPrice: Number(anthologyInfo.memoirPrice),
    memoirsCP: Number(anthologyInfo.memoirsCP),
    memoirBufferCP: Number(anthologyInfo.memoirBufferCP),
    whitelistCP: Number(anthologyInfo.whitelistCP),
  };
};
