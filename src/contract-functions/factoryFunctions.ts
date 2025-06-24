import {
  readContract,
  //watchContractEvent,
  writeContract,
} from "@wagmi/core";
//import { parseEther } from "viem";
import { AnthologyFactoryABI } from "@abi/AnthologyFactoryABI";
import { networks } from "@src/wagmiConfig";
import { retryWithBackoff } from "@utils/retryWithBackoff";
import { getCurrentConfig } from "./helpers";
import { CACHE_DURATION_MS } from "@src/utils/constants";
import { safeStringify } from "@src/utils/safeStringify";

const AnthologyFactoryAddress = import.meta.env.VITE_FACTORY_CONTRACT;

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
  | "userContracts" //default getter
  | "getWhitelistedUsers"
  | "isWhitelisted"
  | "getContractTitle"
  | "isDeployedContract" // not in this ABI -
  | "deployedContracts" // default getter -> Does not work becase the state variable is not
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

const chain = networks[0];

const getCacheFactoryKey = (fn: string, args: unknown[]) =>
  `readFactory:${fn}:${safeStringify(args)}`;

const isFresh = (timestamp: number) =>
  Date.now() - timestamp < CACHE_DURATION_MS;

export const readFactory = async <T = unknown>(
  functionName: readFactoryFunctions,
  args?: unknown[]
): Promise<T | undefined> => {
  const key = getCacheFactoryKey(functionName, args as unknown[]);
  const cached = localStorage.getItem(key);

  if (cached) {
    const { time, result } = JSON.parse(cached);
    if (isFresh(time)) {
      console.info(`[readFactory] Using cached result for ${functionName}`);
      return result as T;
    }
  }
  try {
    const config = getCurrentConfig();

    const result = await retryWithBackoff(() =>
      readContract(config, {
        abi: AnthologyFactoryABI,
        address: AnthologyFactoryAddress,
        functionName,
        chainId: chain.id,
        args,
      })
    );

    localStorage.setItem(key, safeStringify({ time: Date.now(), result }));

    return result as T;
  } catch (error) {
    console.warn(`[readFactory] Failed: ${functionName}`);
    console.error(error);
    return undefined;
  }
};

export const writeFactory = async <T = unknown>(
  functionName: writeFactoryFunctions,
  args?: unknown[]
): Promise<T | undefined> => {
  try {
    const config = getCurrentConfig();

    const result = await retryWithBackoff(() =>
      writeContract(config, {
        abi: AnthologyFactoryABI,
        address: AnthologyFactoryAddress,
        functionName,
        args,
        chainId: chain.id,
      })
    );

    return result as T;
  } catch (error) {
    console.warn(`[writeAnthology] Failed: ${functionName}`);
    console.error(error);
    return undefined;
  }
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
