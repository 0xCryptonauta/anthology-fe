import { readAnthology } from "@src/contract-functions/anthologyFunctions";
import { readFactory } from "@src/contract-functions/factoryFunctions";

export const fetchFactoryInfo = async () => {
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

function hexToString(hex: string) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

interface AnthologyInfoProps {
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
}

export const fetchAnthologyInfo = async (contractAddr: `0x${string}`) => {
  const anthologyInfo = await readAnthology<AnthologyInfoProps>(
    contractAddr,
    "getAnthologyInfo"
  );

  if (!anthologyInfo) {
    console.warn(
      `[fetchAnthologyInfo] Failed: getAnthologyInfo @ ${contractAddr}`
    );
    return undefined;
  }
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
