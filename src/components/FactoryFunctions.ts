import {
  readContract,
  //watchContractEvent,
  writeContract,
} from "@wagmi/core";
import { hardhat as chain } from "@wagmi/core/chains";
//import { parseEther } from "viem";
import AnthologyFactoryABI from "../abi/AnthologyFactoryABI.json";
import { config } from "../config";

const AnthologyFactoryAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

type readFunctions =
  | "getContractInfo"
  | "anthologyPrice"
  | "isFrozen"
  | "whitelistEnabled"
  | "useERC20"
  | "erc20Token"
  | "owner"
  | "getUsers"
  | "getUserContracts"
  | "getWhitelistedUsers"
  | "isWhitelisted"
  | "getUserContracts";

export const updateAnthologyPrice = async (_newValue: bigint) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "setAnthologyPrice",
    args: [_newValue],
    chainId: chain.id,
  });

  return result;
};

export const callSetUseERC20 = async (_newValue: boolean) => {
  console.log("res.erc20:", chain.id);
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "setUseERC20",
    args: [_newValue],
    chainId: chain.id,
  });

  console.log("res.erc20:", result);

  return result;
};

export const readFactory = async (
  _functionName: readFunctions,
  _args?: unknown[]
) => {
  const result = await readContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: _functionName,
    chainId: chain.id,
    args: _args,
  });

  return result;
};

// ---------------------------- Owner only ---------------------------------

export const callSetIsFrozen = async (_newValue: boolean) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "setIsFrozen",
    args: [_newValue],
    chainId: chain.id,
  });

  return result;
};

export const addToWhitelist = async (_address: string) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "addToWhitelist",
    args: [_address],
    chainId: chain.id,
  });

  return result;
};

export const removeFromWhitelist = async (_address: string) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "removeFromWhitelist",
    args: [_address],
    chainId: chain.id,
  });

  return result;
};

export const enableWhitelist = async (_newValue: boolean) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "enableWhitelist",
    args: [_newValue],
    chainId: chain.id,
  });

  return result;
};

export const setERC20Token = async (_newTokenAddr: string) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "setERC20Token",
    args: [_newTokenAddr],
    chainId: chain.id,
  });

  return result;
};

/* 
  Missing functions
    Public:
      * getUserContracts()
      - deployContract()  <------------- Ultimo
      * isWhitelisted()

    Owner
      * enableWhitelist()
      * addToWhitelist()
      * removeFromWhitelist()
      * setERC20Token()
      * setAnthologyPrice()
      - withdraw()

    -> Commit !!!
    -> Continue with Redux tool kit
    -> fix logic with address and only owner visibility
    -> Add shadcn components
    -> Continue with deployContract()
*/
