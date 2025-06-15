//import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
//import { useParams } from "react-router-dom";

import { useState } from "react";

import { Memoirs } from "@components/Anthology/Memoirs";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { SkinSelector } from "@src/components/Layout/SkinSelector";
import { OrderSelector, OrderType } from "@src/components/Layout/OrderSelector";
import { Address, SkinType } from "@src/types/common";

import { LocalAnthologyOwner } from "@src/components/Anthology/LocalAnthologyOwner";
import { LocalAnthologyState } from "@src/components/Anthology/LocalAnthologyState";
import { DEFAULT_SKIN } from "@src/utils/constants";
import { FormatAnthologyTitle } from "@src/utils/FormatAnthologyTitle";

export const LocalAnthologyView = () => {
  //const dispatch = useAppDispatch();
  const { currentPath } = useAppSelector((state) => state.user);

  //const { ethAddr, } = useParams();

  //let contractAddr = "";
  const contractAddr = currentPath.split("/")[1] as Address;

  const { contractsTitles } = useAppSelector((state) => state.localAnthology);
  const defaultSkin = useAppSelector(
    (state) => state.localAnthology.defaultSkin[contractAddr]
  );

  const contractTitle = contractsTitles[contractAddr] || "";

  const [showInfo, setShowInfo] = useState(false);
  const [sudoMode, setSudoMode] = useState(false);

  const [currentSkin, setCurrentSkin] = useState<SkinType>(
    defaultSkin ? defaultSkin : DEFAULT_SKIN
  );
  const [currentOrder, setCurrentOrder] = useState<OrderType>("Newer");

  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ display: "flex", margin: "20px" }}>
        <span style={{ marginRight: "7px" }}>
          <AddMemoir contractAddr={contractAddr} />
        </span>
        {FormatAnthologyTitle(contractTitle)}
      </div>

      <div style={{ display: "flex" }}>
        <div
          onClick={() => setShowInfo(!showInfo)}
          style={{
            backgroundColor: "rgb(143 200 129)",
            color: "#111",
            padding: "6px",
            marginRight: showInfo ? "10px" : "0px",
            borderRadius: "8px",
            border: "1px solid rgb(143 200 129)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          {showInfo ? "Show Anthology" : "Anthology Info"}
        </div>

        {!showInfo && (
          <div>
            <SkinSelector
              value={currentSkin}
              onChange={(newValue) => setCurrentSkin(newValue)}
            />

            <OrderSelector
              value={currentOrder}
              onChange={(newValue) => setCurrentOrder(newValue)}
            />
          </div>
        )}

        {showInfo && (
          <div
            onClick={() => setSudoMode(!sudoMode)}
            style={{
              border: "1px solid darkred",
              padding: "5px",
              borderRadius: "7px",
              cursor: "pointer",
              backgroundColor: "darkred",
            }}
          >
            {sudoMode ? "Anthology info" : "Settings"}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------- */}
      {showInfo ? (
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {sudoMode ? (
              <>
                <LocalAnthologyOwner contractAddr={contractAddr} />
              </>
            ) : (
              <>
                <LocalAnthologyState contractAddr={contractAddr} />
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* <AddMemoir contractAddr={contractAddr} /> */}
          <Memoirs
            contractAddr={contractAddr}
            skin={currentSkin}
            order={currentOrder}
          />
        </>
      )}
    </div>
  );
};
