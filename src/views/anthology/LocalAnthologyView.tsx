//import { useAppDispatch } from "@store/utils/hooks";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
//import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { Memoirs } from "@components/Anthology/Memoirs";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { SkinSelector } from "@src/components/Layout/SkinSelector";
import { OrderSelector, OrderType } from "@src/components/Layout/OrderSelector";
import { Address, SkinType } from "@src/types/common";

import { LocalAnthologyOwner } from "@src/components/Anthology/LocalAnthologyOwner";
import { LocalAnthologyState } from "@src/components/Anthology/LocalAnthologyState";
import { DEFAULT_SKIN } from "@src/utils/constants";
import { FormatAnthologyTitle } from "@src/utils/FormatAnthologyTitle";
import "@src/styles/backgrounds.css";
import { getBgClass } from "@utils/backgrounds";
import { setAnthologyFooterBgClass } from "@src/store/slices/dappSlice";
import { useTranslation } from "@src/i18n/useTranslation";

export const LocalAnthologyView = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentPath } = useAppSelector((state) => state.user);
  const categoryBackgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);

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

  useEffect(() => {
    if (categoryBackgroundsEnabled) {
      dispatch(setAnthologyFooterBgClass(getBgClass(contractAddr)));
    }
    return () => {
      dispatch(setAnthologyFooterBgClass(""));
    };
  }, [categoryBackgroundsEnabled, contractAddr, dispatch]);

  return (
    <div
      className=""
      style={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        minHeight: "100dvh",
      }}
    >
      <div style={{ display: "flex", margin: "20px" }}>
        <span style={{ marginRight: "7px" }}>
          <AddMemoir contractAddr={contractAddr} />
        </span>
        {FormatAnthologyTitle(contractTitle)}
      </div>

      <div
        /* Mobile-first control bar: one compact row (36px controls, 8px gaps)
           that fits down to 320px in both languages. */
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
          padding: "0 8px",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <button
          type="button"
          aria-expanded={showInfo}
          onClick={() => setShowInfo(!showInfo)}
          style={{
            backgroundColor: "rgb(143 200 129)",
            color: "#111",
            height: "36px",
            padding: "0 10px",
            borderRadius: "8px",
            border: "1px solid rgb(143 200 129)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {showInfo ? t("anthology.show") : t("anthology.info")}
        </button>

        {!showInfo && (
          <>
            <SkinSelector
              value={currentSkin}
              onChange={(newValue) => setCurrentSkin(newValue)}
            />

            <OrderSelector
              value={currentOrder}
              onChange={(newValue) => setCurrentOrder(newValue)}
            />
          </>
        )}

        {showInfo && (
          <button
            type="button"
            aria-expanded={sudoMode}
            onClick={() => setSudoMode(!sudoMode)}
            style={{
              border: "1px solid darkred",
              height: "36px",
              padding: "0 10px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "darkred",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {sudoMode ? t("anthology.info") : t("nav.settings")}
          </button>
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
            anthologyAddr={contractAddr}
            order={currentOrder}
            skin={currentSkin}
          />
        </>
      )}
    </div>
  );
};
