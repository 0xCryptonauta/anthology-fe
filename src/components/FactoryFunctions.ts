// @ts-nocheck

import {
  readContract,
  //watchContractEvent,
  writeContract,
} from "@wagmi/core";
import { hardhat as chain } from "@wagmi/core/chains";
//import { parseEther } from "viem";
import { AnthologyFactoryABI } from "../abi/AnthologyFactoryABI";
import { config } from "../config";

const AnthologyFactoryAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

type readFunctions =
  | "getContractInfo"
  | "anthologyPrice"
  | "isFrozen"
  | "whitelistEnabled"
  | "useERC20"
  | "erc20Token"
  | "owner"
  | "getUsers"
  | "getUserCount"
  | "getUserContracts"
  | "getWhitelistedUsers"
  | "isWhitelisted"
  | "getUserContracts"
  | "getContractTitle"
  | "isDeployedContract"
  | "getUserContractsWithTitles"
  | "getMultipleUsersContractsWithTitles";

export const callSetAnthologyPrice = async (_newValue: bigint) => {
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

export const readTitles = async (_args: unknown[]) => {
  const result = await readContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "getContractTitle",
    chainId: chain.id,
    args: _args,
  });

  return result as string[];
};

// Remove and use readFactory
export const callGetUserContracts = async (_args: unknown[]) => {
  const result = await readContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "getUserContracts",
    chainId: chain.id,
    args: _args,
  });

  return result as string[];
};

export const callDeployAnthology = async () => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "deployAnthology",
    args: [],
    chainId: chain.id,
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

export const callAddToWhitelist = async (_address: string) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "addToWhitelist",
    args: [_address],
    chainId: chain.id,
  });

  return result;
};

export const callRemoveFromWhitelist = async (_address: string) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "removeFromWhitelist",
    args: [_address],
    chainId: chain.id,
  });

  return result;
};

export const callEnableWhitelist = async (_newValue: boolean) => {
  const result = await writeContract(config, {
    abi: AnthologyFactoryABI,
    address: AnthologyFactoryAddress,
    functionName: "enableWhitelist",
    args: [_newValue],
    chainId: chain.id,
  });

  return result;
};

export const callSetERC20Token = async (_newTokenAddr: string) => {
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
    FRONT_END
    ** Commit !!!
    ** Pagination of users
    ** Add usersCount to contractInfo
    ** Continue with Redux tool kit
    ** fix logic with address and only owner visibility
    ** Add bootstrap
        ** SidePanel
    ** Add Routes:
        ** /
        ** /account
        ** /info
        ** /about  
    ** deployContract()
    ** Can this be a Progressive web app? an be installable -> yes it can :)
        -> Change update manifest when the time comes
    -> when on how to use paginated users -> 

    CONTRACT

    ** Add mapping(address -> string) contractTitles
    ** Add mapping(address -> bool) deployedContracts
    ** Add getContractTitle(address[]) ->get titles from array of addresses
    ** getUserContractsWithTitle() -> return obj? ask gpt for with mappings
    -> Remove one user
    -> Clean users (?)
    -> Which events are missing
    ** Add message to requires

    -> Add hash Anthology to prevent useless rpc calls
    -> Add variable to anthology to store the skin (post-it, media, etc) - in Anthology
    -> Add description to anthology


    ** Clean whitelist
    -> clean anthology
    -> clean anthology whitelist
*/
