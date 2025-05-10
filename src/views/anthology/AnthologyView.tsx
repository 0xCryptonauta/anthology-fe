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
  SkinType,
} from "@store/slices/anthologySlice";
import { fetchAnthologyInfo } from "@src/contract-functions/fetchContractInfo";
import { Memoirs } from "@components/Anthology/Memoirs";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { AnthologyState } from "@components/Anthology/AnthologyState";
import { AnthologyOwner } from "@components/Anthology/AnthologyOwner";
import { MemoirBuffer } from "@components/Anthology/MemoirBuffer";
import { AnthologyWhitelistedUsers } from "@components/Anthology/AnthologyWhitelistedUsers";
import { SkinSelector } from "@components/Anthology/Memoirs/SkinSelector";
import {
  OrderSelector,
  OrderType,
} from "@components/Anthology/Memoirs/OrderSelector";
import { ActiveView } from "@src/types/common";

const formatTitle = (title?: string): string => {
  if (!title) return ""; // Handle undefined case

  const match = title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)/);
  if (!match) return title; // Return original title if no match

  const [, category, subcategory, item] = match;
  return [category, subcategory, item].filter(Boolean).join(" > ");
};

interface AnthologyViewProps {
  activeView: ActiveView;
  setActiveView: (newActiveView: ActiveView) => void;
}

export const AnthologyView: React.FC<AnthologyViewProps> = ({
  activeView,
  setActiveView,
}) => {
  const dispatch = useAppDispatch();
  //const { userContracts } = useAppSelector((state) => state.factory);

  //const { ethAddr, } = useParams();

  //let contractAddr = "";
  const contractAddr = activeView.split("/")[1] as `0x${string}`;

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

  const [currentSkin, setCurrentSkin] = useState<SkinType>(
    anthology?.anthologyState?.skin === "\0default\0" //TODO: Fix this -> comes from contract encoding
      ? "media"
      : anthology?.anthologyState.skin ?? "media"
  );
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
                  whitelistedUsers: whitelistedUsers as string[],
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
          console.log("RAW:", anthologyInfo.skin);
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
        //height: "100svh",
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
          {showInfo ? "Show memoirs" : "Show Info"}
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
              border: "1px solid white",
              padding: "3px",
              borderRadius: "7px",
              cursor: "pointer",
              backgroundColor: "darkred",
            }}
          >
            {sudoMode ? "Show anthology info" : "Show admin panel"}
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
            setActiveView={setActiveView}
          />
        </>
      )}
    </div>
  );
};
