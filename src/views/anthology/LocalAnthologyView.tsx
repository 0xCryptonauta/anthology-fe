//import { useAppDispatch } from "@store/utils/hooks";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
//import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { Memoirs } from "@components/Anthology/Memoirs";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { SkinSelector } from "@src/components/Layout/SkinSelector";
import { OrderSelector, OrderType } from "@src/components/Layout/OrderSelector";
import { Address, SkinType } from "@src/types/common";

import { AnthologyPanel } from "@src/components/Anthology/AnthologyPanel";
import { DEFAULT_SKIN } from "@src/utils/constants";
import { FormatAnthologyTitle } from "@src/utils/FormatAnthologyTitle";
import "@src/styles/backgrounds.css";
import { getBgClass } from "@utils/backgrounds";
import { setAnthologyFooterBgClass } from "@src/store/slices/dappSlice";
import { useTranslation } from "@src/i18n/useTranslation";
import { useReceivedFrom } from "@src/hooks/useIsReadOnlyAnthology";

export const LocalAnthologyView = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentPath } = useAppSelector((state) => state.user);
  const receivedFrom = useReceivedFrom(currentPath.split("/")[1] as Address);
  const categoryBackgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);

  //const { ethAddr, } = useParams();

  //let contractAddr = "";
  const contractAddr = currentPath.split("/")[1] as Address;

  const { contractsTitles } = useAppSelector((state) => state.localAnthology);
  const defaultSkin = useAppSelector(
    (state) => state.localAnthology.defaultSkin[contractAddr]
  );

  const contractTitle = contractsTitles[contractAddr] || "";

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
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        minHeight: "100dvh",
      }}
    >
      <div style={{ display: "flex", margin: "20px 20px 10px" }}>
        <span style={{ marginRight: "7px" }}>
          <AddMemoir contractAddr={contractAddr} />
        </span>
        {FormatAnthologyTitle(contractTitle)}
      </div>

      {receivedFrom && (
        <span style={{ fontSize: "0.8rem", opacity: 0.9, marginBottom: "10px" }}>
          <span aria-hidden="true">🔒 </span>
          {t("connect.readOnlyBannerPrefix")}{" "}
          <span translate="no">{receivedFrom.nametag}</span>{" "}
          {t("connect.readOnlyBannerSuffix")}
        </span>
      )}

      <div
        /* Mobile-first control bar: one compact row (36px controls, 8px gaps)
           that fits down to 320px in both languages. The 50px inset matches
           the memoir search bar: 5px Memoirs padding + 20px search gutter
           on each side (see Memoirs/index.tsx). */
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          width: "calc(100% - 50px)",
          maxWidth: "600px",
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <AnthologyPanel contractAddr={contractAddr} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <SkinSelector
            value={currentSkin}
            onChange={(newValue) => setCurrentSkin(newValue)}
          />

          <OrderSelector
            value={currentOrder}
            onChange={(newValue) => setCurrentOrder(newValue)}
          />
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      <Memoirs
        anthologyAddr={contractAddr}
        order={currentOrder}
        skin={currentSkin}
      />
    </div>
  );
};
