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
import { AnthologyState } from "@components/Anthology/AnthologyState";
import { AnthologyOwner } from "@components/Anthology/AnthologyOwner";
import { MemoirBuffer } from "@components/Anthology/MemoirBuffer";
import { AnthologyWhitelistedUsers } from "@components/Anthology/AnthologyWhitelistedUsers";
import { SkinSelector } from "@src/components/Layout/SkinSelector";
import { OrderSelector, OrderType } from "@src/components/Layout/OrderSelector";
import { Address, SkinType } from "@src/types/common";
import { removePadding } from "@src/utils/removePadding";
import { DEFAULT_SKIN } from "@src/utils/constants";
import { FormatAnthologyTitle } from "@src/utils/FormatAnthologyTitle";

export const AnthologyView = () => {
  const dispatch = useAppDispatch();
  const { currentPath } = useAppSelector((state) => state.user);

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

  const [showInfo, setShowInfo] = useState(false);
  const [sudoMode, setSudoMode] = useState(false);

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

        {showInfo && userAddr === anthology?.anthologyState.owner && (
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
                <AnthologyOwner contractAddr={contractAddr} />
                {anthology?.anthologyState.useBuffer && (
                  <MemoirBuffer contractAddr={contractAddr} />
                )}
              </>
            ) : (
              <>
                <AnthologyState contractAddr={contractAddr} />
                {anthology?.anthologyState.whitelistEnabled && (
                  <AnthologyWhitelistedUsers contractAddr={contractAddr} />
                )}
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
