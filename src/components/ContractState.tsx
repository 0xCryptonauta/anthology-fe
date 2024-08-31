/* global BigInt */

import React, { useEffect } from "react";
import { readFactory } from "./FactoryFunctions";
import { WhitelistedUsers } from "./WhitelistedUsers";
import { IsWhitelisted } from "./IsWhitelisted";

import { useDispatch, useSelector } from "react-redux";
import {
  updateFactoryBasicInfo,
  updateWhitelistedUsers,
} from "../slices/factorySlice";
import { RootState } from "../store";

export const ContractState: React.FC = () => {
  const dispatch = useDispatch();

  const {
    owner,
    isFrozen,
    whitelistEnabled,
    useErc20,
    erc20Token,
    anthologyPrice,
    userCount,
  } = useSelector((state: RootState) => state.factory);

  // THIS SHOULD BE DONE BY APP.TS (?)
  useEffect(() => {
    const fetchContractData = async () => {
      const contractInfo = await readFactory("getContractInfo");
      const whitelistedUsers = await readFactory("getWhitelistedUsers");

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

      dispatch(
        updateFactoryBasicInfo({
          owner: owner as string,
          isFrozen,
          whitelistEnabled,
          useErc20,
          erc20Token,
          anthologyPrice: Number(anthologyPrice),
          userCount: Number(userCount),
        })
      );

      dispatch(updateWhitelistedUsers(whitelistedUsers as string[]));
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
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        <span>Owner of factory:</span>
        <span style={{ fontSize: "14px" }}>{owner}</span>
        <span>Whitelist Enabled: {whitelistEnabled ? "Yes" : "No"}</span>
        <span>Anthology Price: {anthologyPrice.toString()} ETH</span>
        <span>Use ERC20: {useErc20 ? "Yes" : "No"}</span>
        <span>ERC20 address:</span>
        <span style={{ fontSize: "14px" }}>{erc20Token}</span>
        <span>Deployments Frozen: {isFrozen ? "Yes" : "No"}</span>
        <span>Users count: {userCount.toString()}</span>
      </div>

      <IsWhitelisted />
      <WhitelistedUsers />
    </div>
  );
};
