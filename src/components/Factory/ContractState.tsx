/* global BigInt */

import React, { useEffect } from "react";

import { useAppSelector } from "@store/utils/hooks";

//import { IsWhitelisted } from "./IsWhitelisted";
import { WhitelistedUsers } from "./WhitelistedUsers";
import { Card } from "react-bootstrap";

const AnthologyFactoryAddress = import.meta.env.VITE_FACTORY_ARBITRUM; //Arbitrum

export const ContractState: React.FC = () => {
  const {
    owner,
    isFrozen,
    whitelistEnabled,
    useErc20,
    erc20Token,
    anthologyPrice,
    userCount,
  } = useAppSelector((state) => state.factory);

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
          <Card className="cardStyle">
            <Card.Body>
              <Card.Title style={{ fontSize: "18px", textAlign: "center" }}>
                Contract Addr
              </Card.Title>
              <Card.Text style={{ fontSize: "12px" }}>
                {AnthologyFactoryAddress}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body>
              <Card.Title style={{ fontSize: "18px", textAlign: "center" }}>
                Factory Owner
              </Card.Title>
              <Card.Text style={{ fontSize: "12px" }}>{owner}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body className="cardBodyStyle">
              <Card.Title style={{ fontSize: "18px" }}>Chain</Card.Title>
              <Card.Text>Arbitrum</Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body className="cardBodyStyle">
              <Card.Title style={{ fontSize: "18px" }}>Status</Card.Title>
              <Card.Text>{isFrozen ? "Frozen" : "Active"}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body className="cardBodyStyle">
              <Card.Title style={{ fontSize: "18px" }}>Whitelist</Card.Title>
              <Card.Text>
                {whitelistEnabled ? "Active" : "Not Active"}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body className="cardBodyStyle">
              <Card.Title style={{ fontSize: "18px" }}>
                Anthology Price
              </Card.Title>
              <Card.Text>
                {anthologyPrice}
                {!useErc20 && " ETH"}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body className="cardBodyStyle">
              <Card.Title style={{ fontSize: "18px" }}>Currency</Card.Title>
              <Card.Text>{useErc20 ? "ERC20" : "ETH"}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body>
              <Card.Title style={{ fontSize: "18px", textAlign: "center" }}>
                ERC20 address
              </Card.Title>
              <Card.Text style={{ fontSize: "12px" }}>{erc20Token}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="cardStyle">
            <Card.Body className="cardBodyStyle">
              <Card.Title style={{ fontSize: "18px" }}>Users</Card.Title>
              <Card.Text>{userCount}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* <IsWhitelisted /> */}
      {whitelistEnabled && <WhitelistedUsers />}
    </div>
  );
};
