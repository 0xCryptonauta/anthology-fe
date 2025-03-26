import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  readAnthology,
  //writeAnthology,
} from "../../contract-functions/AnthologyFunctions";

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
} from "../../slices/anthologySlice";
import { fetchAnthologyInfo } from "../../utils/initialStateUpdate";
import { Memoirs } from "../../components/Anthology/Memoirs";
import { AddMemoir } from "../../components/Anthology/AddMemoir";
import { AnthologyState } from "../../components/Anthology/AnthologyState";
import { AnthologyOwner } from "../../components/Anthology/AnthologyOwner";
import { MemoirBuffer } from "../../components/Anthology/MemoirBuffer";
import { AnthologyWhitelistedUsers } from "../../components/Anthology/AnthologyWhitelistedUsers";
import { SkinSelector } from "../../components/SkinSelector";
import { OrderSelector, OrderType } from "../../components/OrderSelector";

export const AnthologyView = () => {
  const dispatch = useDispatch();
  const { userContracts } = useSelector((state: RootState) => state.factory);

  const { ethAddr, id } = useParams();

  let contractAddr = "";

  if (JSON.stringify(userContracts) != "{}") {
    try {
      contractAddr = userContracts[ethAddr as string][Number(id)];
    } catch (error) {
      console.error("Error getting userContracts:", error);
    }
  }

  const { userAddr } = useSelector((state: RootState) => state.user);
  const anthology = useSelector((state: RootState) =>
    contractAddr ? state.anthology[contractAddr] : undefined
  );

  const contractTitle = anthology?.anthologyState.title;

  const [showInfo, setShowInfo] = useState(false);
  const [sudoMode, setSudoMode] = useState(false);

  const [currentSkin, setCurrentSkin] = useState<SkinType>(
    anthology
      ? anthology?.anthologyState?.skin === "\0default\0" //TODO: Fix this -> comes from contract encoding
        ? "text"
        : anthology?.anthologyState.skin
      : "text"
  );
  const [currentOrder, setCurrentOrder] = useState<OrderType>("Newer");

  console.log("Changing from AnthologyView to:", currentOrder);

  useEffect(() => {
    console.log("useEffect AnthologyView");

    const setupAnthology = async () => {
      console.log("useEffect callAnthology");

      //const anthologyInfo = await fetchAnthologyInfo(contractAddr);

      let memoirsCP;
      let whitelistCP;
      let memoirBufferCP;

      if (ethAddr && contractAddr) {
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
        <AddMemoir contractAddr={contractAddr} /> {contractTitle}
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
                <AnthologyState />
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
