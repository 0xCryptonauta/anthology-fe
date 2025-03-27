// @ts-nocheck

import {
  readContract,
  //watchContractEvent,
  writeContract,
} from "@wagmi/core";
//import { hardhat as chain } from "@wagmi/core/chains";
import { arbitrum as chain } from "@wagmi/core/chains";
//import { parseEther } from "viem";
import { AnthologyABI } from "@abi/AnthologyABI";
import { config } from "@src/config";

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

export const readAnthology = async (
  _contractAddr: string,
  _functionName: readFunctions,
  _args?: unknown[]
) => {
  let result;
  try {
    result = await readContract(config, {
      abi: AnthologyABI,
      address: _contractAddr,
      functionName: _functionName,
      chainId: chain.id,
      args: _args,
    });
  } catch (error) {
    //result = undefined;
    console.log("ERROR calling:", _functionName);
    console.log("FOR:", _contractAddr);
    console.log("EEOR:", error);
  }

  return result;
};

export const writeAnthology = async (
  _contractAddr: string,
  _functionName: writeFunctions,
  _args?: unknown[]
) => {
  try {
    const result = await writeContract(config, {
      abi: AnthologyABI,
      address: _contractAddr,
      functionName: _functionName,
      args: _args,
      chainId: chain.id,
    });

    return result;
  } catch (error) {
    //result = undefined;
    console.log("ERROR calling:", _functionName);
    console.log("FOR:", _contractAddr);
    console.log("EEOR:", error);
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
