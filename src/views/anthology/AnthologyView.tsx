import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
//import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import {
  readAnthology,
  //writeAnthology,
} from "@src/contract-functions/anthologyFunctions";

import {
  addAnthology,
  AnthologyInfoInterface,
  MemoirInterface,
  updateMemoirs,
  updateWhitelist,
  updateMemoirBuffer,
  updateAnthologyCP,
  updateAnthologyWhitelistCP,
  updateAnthologyBufferCP,
} from "@store/slices/anthologySlice";
import { fetchAnthologyInfo } from "@src/contract-functions/fetchContractInfo";
import { Memoirs } from "@components/Anthology/Memoirs";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { AnthologyPanel } from "@components/Anthology/AnthologyPanel";
import { SkinSelector } from "@src/components/Layout/SkinSelector";
import { OrderSelector, OrderType } from "@src/components/Layout/OrderSelector";
import { Address, SkinType } from "@src/types/common";
import { removePadding } from "@src/utils/removePadding";
import { DEFAULT_SKIN } from "@src/utils/constants";
import { FormatAnthologyTitle } from "@src/utils/FormatAnthologyTitle";
import "@src/styles/backgrounds.css";
import { getBgClass } from "@utils/backgrounds";
import { setAnthologyFooterBgClass } from "@src/store/slices/dappSlice";

export const AnthologyView = () => {
  const dispatch = useAppDispatch();
  const { currentPath } = useAppSelector((state) => state.user);
  const categoryBackgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);

  //const { ethAddr, } = useParams();

  //let contractAddr = "";
  const contractAddr = currentPath.split("/")[1] as Address;

  /*   if (JSON.stringify(userContracts) != "{}") {
    try {
      contractAddr = userContracts[ethAddr as string][Number(id)];
    } catch (error) {
      console.error("Error getting userContracts:", error);
    }
  } */

  const { userAddr } = useAppSelector((state) => state.user);

  const anthology = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr] : undefined
  );

  const contractTitle = anthology?.anthologyState.title;

  const initialSkin: SkinType = anthology?.anthologyState?.skin ?? DEFAULT_SKIN;
  const [currentSkin, setCurrentSkin] = useState<SkinType>(initialSkin);

  const [currentOrder, setCurrentOrder] = useState<OrderType>("Newer");

  useEffect(() => {
    //console.log("useEffect AnthologyView");

    const setupAnthology = async () => {
      //console.log("useEffect callAnthology");

      //const anthologyInfo = await fetchAnthologyInfo(contractAddr);

      let memoirsCP;
      let whitelistCP;
      let memoirBufferCP;

      if (contractAddr) {
        if (anthology) {
          memoirsCP = await readAnthology(contractAddr, "memoirsCP");

          if (anthology?.anthologyState.memoirsCP != memoirsCP) {
            console.log("CP has changed");
            const _memoirs = (await readAnthology(
              contractAddr,
              "getMemoirs"
            )) as MemoirInterface[];

            const memoirsString = _memoirs.map((memoir) => ({
              ...memoir,
              timestamp: memoir.timestamp.toString(),
            }));

            dispatch(
              updateAnthologyCP({
                contract: contractAddr,
                memoirsCP: Number(memoirsCP),
              })
            );

            dispatch(
              updateMemoirs({
                contract: contractAddr,
                memoirs: memoirsString,
              })
            );
          }

          if (anthology.anthologyState.whitelistEnabled) {
            whitelistCP = await readAnthology(contractAddr, "whitelistCP");

            if (anthology.anthologyState.whitelistCP != whitelistCP) {
              const whitelistedUsers = await readAnthology(
                contractAddr,
                "getWhitelist"
              );

              dispatch(
                updateAnthologyWhitelistCP({
                  contract: contractAddr,
                  whitelistCP: Number(whitelistCP),
                })
              );

              dispatch(
                updateWhitelist({
                  contract: contractAddr,
                  whitelistedUsers: whitelistedUsers as Address[],
                })
              );
            }
          }

          if (
            anthology.anthologyState.useBuffer &&
            anthology.anthologyState.owner === userAddr
          ) {
            memoirBufferCP = await readAnthology(
              contractAddr,
              "memoirBufferCP"
            );

            if (anthology.anthologyState.memoirBufferCP != memoirBufferCP) {
              const memoirBuffer = (await readAnthology(
                contractAddr,
                "getMemoirBuffer"
              )) as MemoirInterface[];

              const memoirBufferString = memoirBuffer.map((memoir) => ({
                ...memoir,
                timestamp: memoir.timestamp.toString(),
              }));

              dispatch(
                updateAnthologyBufferCP({
                  contract: contractAddr,
                  memoirBufferCP: Number(memoirBufferCP),
                })
              );

              dispatch(
                updateMemoirBuffer({
                  contract: contractAddr,
                  memoirBuffer: memoirBufferString,
                })
              );
            }
          }
        } else {
          console.log("New anthology added");
          const anthologyInfo = await fetchAnthologyInfo(contractAddr);
          console.log("RAW:", anthologyInfo?.skin);
          if (anthologyInfo?.skin) {
            setCurrentSkin(removePadding(anthologyInfo?.skin) as SkinType);
          }
          dispatch(
            addAnthology({
              contract: contractAddr,
              anthologyInfo: anthologyInfo as AnthologyInfoInterface,
            })
          );

          const _memoirs = (await readAnthology(
            contractAddr,
            "getMemoirs"
          )) as MemoirInterface[];

          const memoirsString = _memoirs.map((memoir) => ({
            ...memoir,
            timestamp: memoir.timestamp.toString(),
          }));

          dispatch(
            updateMemoirs({
              contract: contractAddr,
              memoirs: memoirsString,
            })
          );
        }
      }
    };

    //Validate if contract already exist before making rpc call
    setupAnthology();
  }, []);

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
        minHeight: "95dvh",
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
