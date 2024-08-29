/* global BigInt */

import React, { useEffect, useState } from "react";
import { parseEther } from "viem";
import { readFactory } from "./FactoryFunctions";
import { WhitelistedUsers } from "./WhitelistedUsers";
import { IsWhitelisted } from "./IsWhitelisted";

export const ContractState: React.FC = () => {
  const [whitelistEnabled, setWhitelistEnabled] = useState<boolean>(false);
  const [anthologyPrice, setAnthologyPrice] = useState<bigint>(parseEther("0"));
  const [useERC20, setUseERC20] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [erc20Token, setErc20Token] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [userCount, setUserCount] = useState<bigint>(0n);

  useEffect(() => {
    const fetchContractData = async () => {
      const contractInfo = await readFactory("getContractInfo");
      const {
        isFrozen,
        whitelistEnabled,
        useERC20,
        erc20Token,
        anthologyPrice,
        userCount,
      } = contractInfo as {
        isFrozen: boolean;
        whitelistEnabled: boolean;
        useERC20: boolean;
        erc20Token: string;
        anthologyPrice: number;
        userCount: bigint;
      };
      const owner = await readFactory("owner");

      const users = await readFactory("getUsers");
      console.log("users:", users);

      setOwner(owner as string);
      setWhitelistEnabled(whitelistEnabled as boolean);
      setAnthologyPrice(
        parseEther(anthologyPrice ? anthologyPrice.toString() : "0") as bigint
      );
      setUseERC20(useERC20 as boolean);
      setIsFrozen(isFrozen as boolean);
      setErc20Token(erc20Token as string);
      setUserCount(userCount as bigint);
      console.log("userCount:", userCount);
    };

    fetchContractData();

    /* const unwatch = watchContractEvent(config, {
      address: AnthologyFactoryAddress,
      abi: AnthologyFactoryABI,
      eventName: "PaymentMethodUpdated",
      onLogs(logs) {
        console.log("New logs!", logs[0]?.args.useERC20);
        setUseERC20(logs[0].args.useERC20);
      },
      chainId: chain.id,
    }); */

    //unwatch();
    //console.log("unwatch:", unwatch);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
        }}
      >
        <h3>Contract Variables</h3>
        <span>Owner of factory: {owner}</span>
        <span>Whitelist Enabled: {whitelistEnabled ? "Yes" : "No"}</span>
        <span>Anthology Price: {anthologyPrice.toString()} ETH</span>
        <span>Use ERC20: {useERC20 ? "Yes" : "No"}</span>
        <span>ERC20 address: {erc20Token}</span>
        <span>Deployments Frozen: {isFrozen ? "Yes" : "No"}</span>
        <span>Users count: {userCount.toString()}</span>
      </div>

      <IsWhitelisted />
      <WhitelistedUsers />
    </div>
  );
};

//TODO: sc-
//    delete user* from array not mapping
//    delete one anthology from mapping
//    implement pagination in users
//    *implment function to get all core state (5 variables) at once
//    implment events that are missing

//    Add hash Anthology to prevent useless rpc calls
//    Add variable to anthology to store the skin (post-it, media, etc) - in Anthology

//
