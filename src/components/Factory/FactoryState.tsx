/* global BigInt */

import React from "react";

import { useAppSelector } from "@store/utils/hooks";

//import { IsWhitelisted } from "./IsWhitelisted";
import { WhitelistedUsers } from "./WhitelistedUsers";
import { Card } from "@components/Layout/Card";
import { CHAIN_SCAN_URL } from "@src/utils/constants";

const AnthologyFactoryAddress = import.meta.env.VITE_FACTORY_CONTRACT;

export const FactoryState: React.FC = () => {
  const {
    owner,
    isFrozen,
    whitelistEnabled,
    useErc20,
    erc20Token,
    anthologyPrice,
    userCount,
  } = useAppSelector((state) => state.factory);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: "space-around",
        //border: "1px solid white",
        width: "100%",

        borderRadius: "7px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          //border: "1px solid white",
          width: "fit-content",
          //padding: "7px",
          borderRadius: "7px",
          //margin: "5px",
        }}
      >
        <h3>Factory Variables</h3>

        <div
          style={{
            //border: "1px solid white",
            padding: "5px",
            borderRadius: "7px",
            margin: "3px",
            width: "380px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Card
            title="Contract Addr"
            content={AnthologyFactoryAddress}
            contentHref={CHAIN_SCAN_URL + AnthologyFactoryAddress}
          />

          <Card title="Factory Owner" content={owner} />

          <Card title="Chain" content="Arbitrum" />

          <Card title="Status" content={isFrozen ? "Frozen" : "Active"} />

          <Card
            title="Whitelist"
            content={whitelistEnabled ? "Active" : "Not Active"}
          />

          <Card
            title="Anthology Price"
            content={String(anthologyPrice) + !useErc20 && " ETH"}
          />

          <Card title="Currency" content={useErc20 ? "ERC20" : "ETH"} />

          <Card title="ERC20 address" content={erc20Token} />

          <Card title="Users" content={String(userCount)} />
        </div>
      </div>

      {/* <IsWhitelisted /> */}
      {whitelistEnabled && <WhitelistedUsers />}
    </div>
  );
};
