import { readContract, writeContract } from "@wagmi/core";
//import { parseEther } from "viem";
import { AnthologyABI } from "@abi/AnthologyABI";
import { networks } from "@src/wagmiConfig";
import { retryWithBackoff } from "@utils/retryWithBackoff";
import { getCurrentConfig } from "./helpers";
import { safeStringify } from "@src/utils/safeStringify";
import { CACHE_DURATION_MS } from "@src/utils/constants";

type readFunctions =
  | "owner"
  | "title"
  | "memoirPrice"
  | "anthologyHash"
  | "memoirsCP"
  | "skin"
  | "whitelistCP"
  | "memoirBufferCP"
  | "getMemoirs"
  | "getMemoirBuffer"
  | "getAnthologyInfo"
  | "getWhitelist";

type writeFunctions =
  | "setTitle"
  | "setSkin"
  | "createMemoir"
  | "setMemoirPrice"
  | "setUseERC20"
  | "setERC20Token"
  | "enableWhitelist"
  | "addToWhitelist"
  | "removeFromWhitelist"
  | "setUseBuffer"
  | "acceptMemoir"
  | "declineMemoir"
  | "setMaxMemoirs"
  | "cleanMemoirs"
  | "cleanMemoirBuffer"
  | "cleanWhitelist"
  | "deleteMemoir";

const chain = networks[0];

const getCacheAnthologyKey = (fn: string, args: unknown[]) =>
  `readAnthology:${fn}:${safeStringify(args)}`;

const isFresh = (timestamp: number) =>
  Date.now() - timestamp < CACHE_DURATION_MS;

export const readAnthology = async <T = unknown>(
  contractAddr: `0x${string}`,
  functionName: readFunctions,
  args?: unknown[]
): Promise<T | undefined> => {
  const key = getCacheAnthologyKey(functionName, args as unknown[]);
  const cached = localStorage.getItem(key);

  if (cached) {
    const { time, result } = JSON.parse(cached);
    if (isFresh(time)) {
      console.info(`[readAnthogy] Using cached result for ${functionName}`);
      return result as T;
    }
  }
  try {
    const config = getCurrentConfig();

    const result = await retryWithBackoff(() =>
      readContract(config, {
        abi: AnthologyABI,
        address: contractAddr,
        functionName,
        chainId: chain.id,
        args,
      })
    );

    localStorage.setItem(key, safeStringify({ time: Date.now(), result }));

    return result as T;
  } catch (error) {
    console.warn(`[readAnthology] Failed: ${functionName} @ ${contractAddr}`);
    console.error(error);
    return undefined;
  }
};

export const writeAnthology = async <T = unknown>(
  contractAddr: `0x${string}`,
  functionName: writeFunctions,
  args?: unknown[]
): Promise<T | undefined> => {
  try {
    const config = getCurrentConfig();

    const result = await retryWithBackoff(() =>
      writeContract(config, {
        abi: AnthologyABI,
        address: contractAddr,
        functionName,
        args,
        chainId: chain.id,
      })
    );

    return result as T;
  } catch (error) {
    console.warn(`[writeAnthology] Failed: ${functionName} @ ${contractAddr}`);
    console.error(error);
    return undefined;
  }
};

/* 
    ** setTitle
    ** createMemoir
    ** getMemoirs
    ** getAnthologyHash
    ** Only owner can change title
    ** Display anthologyInfo
    ** Add owner only functions and components -> 7
      ** Accept memoir from buffer
      ** Decline memoir from buffer
      ** Delete memoir from array of memoirs -> deleting changes 1 items index, so array need to be called again after deletion
          ** getMemoirBuffer is called by user, so the ids greater than lenght (cuz new addings) are not count till user calls again
      ** setMaxMemoirs
      ** DANGER: 
          ** cleanMemoirs
          ** cleanMemoirBuffer
          ** cleanWhitelist
          ** cleanWhitelist (factory)
          ** cleanUsers (factory)
          -> deleteUser                 <<----------------
    ** Display whitelist

    ** Hash memoirBuffer to avoid calls -> not hash but checkpoint (incremental value due to change)
    ** store all info in the store 
        ** anthologyInfo
        ** memoirs
        ** memoirBuffer
        ** whitelist
            ** Then persist the data.

    ** How to toggle between anthology and state/owner -> toggle/view button

    ** call CheckPoint to validate no change before getMemoirs()
      if CP is checked by front end, logic of call is handled by frontend
      ** If CP has not changed -> do nothing
      ** If CP has changed -> getArray
      ** fetchAnthologyInfo gets 10 variables at one, should i add anthologyInfoCP?

    ** Add hash Anthology to prevent useless rpc calls
    ** Add owner to getContractInfo()
    ** Call whitelistedUsers only if whitelist is enable

    ** Clean whitelist
    ** clean anthology
    ** clean anthology whitelist

    ** memoirsCP = 0;
    ** memoirBufferCP = 0;
    ** whitelistCP = 0;

    ** 1st render getContractInfo -> after redux persist only call getUserCP
        -> IF error -> call getContractInfo (?)
    ** Add CP to users -> usersCP (?)
    ** Change users type from address[] to mapping(uint => address)
        ** create deleteUser
            ** 0x0000 deleteUser(<index>)
        ** cleanUsers -> delete users -> cannot, too expensive 
        ** addUser (?) -> NO
        ** there is a problem with the store and deploy chaindID (?) -> move reconnect to rootview useEffect
        ** change in userCP diff can be used to get users paginated

    ** Add variable to anthology to store the skin (post-it, media, etc) - in Anthology
    ** Add description to anthology -> (?) -> NO to long

    -> Change string for bytes50, bytes256 ??? is it worth it?
        ->  If no -> Change back skin to string type

    -> After cleanUsers, new users are added to users -> what to do?
*/
