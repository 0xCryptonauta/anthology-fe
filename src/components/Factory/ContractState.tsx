/* global BigInt */

import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { RootState } from "../../store";
import { IsWhitelisted } from "./IsWhitelisted";
import { WhitelistedUsers } from "./WhitelistedUsers";

export const ContractState: React.FC = () => {
  const {
    owner,
    isFrozen,
    whitelistEnabled,
    useErc20,
    erc20Token,
    anthologyPrice,
    userCount,
  } = useSelector((state: RootState) => state.factory);

  useEffect(() => {
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
        <span>Anthology Price: {anthologyPrice?.toString()} ETH</span>
        <span>Use ERC20: {useErc20 ? "Yes" : "No"}</span>
        <span>ERC20 address:</span>
        <span style={{ fontSize: "14px" }}>{erc20Token}</span>
        <span>Deployments Frozen: {isFrozen ? "Yes" : "No"}</span>
        <span>Users count: {userCount?.toString()}</span>
      </div>

      <IsWhitelisted />
      <WhitelistedUsers />
    </div>
  );
};
