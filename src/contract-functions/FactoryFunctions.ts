// @ts-nocheck

import {
  readContract,
  //watchContractEvent,
  writeContract,
} from "@wagmi/core";
//import { hardhat as chain } from "@wagmi/core/chains";
import { arbitrum as chain } from "@wagmi/core/chains";
//import { parseEther } from "viem";
import { AnthologyFactoryABI } from "@abi/AnthologyFactoryABI";
import { config } from "@src/wagmiConfig";

//const AnthologyFactoryAddress = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS; //Optimism
const AnthologyFactoryAddress = import.meta.env.VITE_FACTORY_ARBITRUM; //Arbitrum

type readFactoryFunctions =
  | "getContractInfo"
  | "anthologyPrice"
  | "isFrozen"
  | "whitelistEnabled"
  | "useERC20"
  | "erc20Token"
  | "userCount"
  | "owner"
  | "getUsers"
  | "usersCP"
  | "getUserContracts"
  | "getWhitelistedUsers"
  | "isWhitelisted"
  | "getContractTitle"
  | "isDeployedContract"
  | "getUserContractsWithTitles"
  | "getUsersContractsWithTitles";

type writeFactoryFunctions =
  | "deployAnthology"
  | "setAnthologyPrice"
  | "setUseERC20"
  | "cleanWhitelist"
  | "cleanUsers"
  | "setIsFrozen"
  | "addToWhitelist"
  | "removeFromWhitelist"
  | "enableWhitelist"
  | "setERC20Token";

export const readFactory = async (
  _functionName: readFactoryFunctions,
  _args?: unknown[]
) => {
  let result;
  console.log("Reading factory: ", _functionName);
  try {
    result = await readContract(config, {
      abi: AnthologyFactoryABI,
      address: AnthologyFactoryAddress,
      functionName: _functionName,
      chainId: chain.id,
      args: _args,
    });
  } catch (error) {
    console.log("Error reading:", _functionName);
    console.log("error:", error);
  }

  return result;
};

export const writeFactory = async (
  _functionName: writeFactoryFunctions,
  _args?: unknown[]
) => {
  let result;
  console.log("writing to factory");
  try {
    result = await writeContract(config, {
      abi: AnthologyFactoryABI,
      address: AnthologyFactoryAddress,
      functionName: _functionName,
      chainId: chain.id,
      args: _args,
    });
  } catch (error) {
    console.log("Error writing:", _functionName);
    console.log("error:", error);
  }

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
    ** delete getter from only public -> it has default getter as name o variable in read
    ** Remove one user
    ** Clean users (?)
    -> Which events are missing
    ** Add message to requires

    ** Add hash Anthology to prevent useless rpc calls
    ** Add variable to anthology to store the skin (post-it, media, etc) - in Anthology
    ** Add description to anthology -> NO too long


    ** Clean whitelist
    ** clean anthology
    ** clean anthology whitelist
*/
