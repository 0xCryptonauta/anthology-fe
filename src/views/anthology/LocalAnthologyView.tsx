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

const formatTitle = (title?: string): string => {
  if (!title) return ""; // Handle undefined case

  const match = title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)/);
  if (!match) return title; // Return original title if no match

  const [, category, subcategory, item] = match;
  return [category, subcategory, item].filter(Boolean).join(" > ");
};

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
    defaultSkin ? defaultSkin : "media"
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
      <h3>
        <AddMemoir contractAddr={contractAddr} /> {formatTitle(contractTitle)}
      </h3>

      <div style={{ display: "flex" }}>
        <div
          onClick={() => setShowInfo(!showInfo)}
          style={{
            border: "1px solid white",
            padding: "3px",
            borderRadius: "7px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {showInfo ? "Anthology" : "Show Info"}
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
              //border: "1px solid white",
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
