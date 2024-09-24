import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  readAnthology,
  writeAnthology,
} from "../../components/ContractFunctions/AnthologyFunctions";

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
} from "../../slices/anthologySlice";
import { fetchAnthologyInfo } from "../../functions/initialStateUpdate";
import { Memoirs } from "../../components/Anthology/Memoirs";
import { AddMemoir } from "../../components/Anthology/AddMemoir";
import { AnthologyState } from "../../components/Anthology/AnthologyState";
import { AnthologyOwner } from "../../components/Anthology/AnthologyOwner";
import { MemoirBuffer } from "../../components/Anthology/MemoirBuffer";
import { AnthologyWhitelistedUsers } from "../../components/Anthology/AnthologyWhitelistedUsers";

export const AnthologyView = () => {
  const dispatch = useDispatch();
  const { userContracts, contractsTitles } = useSelector(
    (state: RootState) => state.factory
  );

  const { ethAddr, id } = useParams();

  const [showInfo, setShowInfo] = useState(false);
  const [sudoMode, setSudoMode] = useState(false);

  let contractAddr = "";
  let contractTitle = "";

  if (JSON.stringify(userContracts) != "{}") {
    try {
      contractAddr = userContracts[ethAddr as string][Number(id)];
      contractTitle = contractsTitles && contractsTitles[contractAddr];
    } catch (error) {
      console.error("Error getting userContracts:", error);
    }
  }
  //const anthologies = useSelector((state: RootState) => state.anthology);

  const { userAddr } = useSelector((state: RootState) => state.user);
  const anthology = useSelector((state: RootState) =>
    contractAddr ? state.anthology[contractAddr] : undefined
  );

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
          console.log("Existing anthology updated - updating CP");
          memoirsCP = await readAnthology(contractAddr, "memoirsCP");

          if (anthology?.anthologyState.memoirsCP != memoirsCP) {
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

  const fillAnthology = async () => {
    const txHash = await writeAnthology(contractAddr, "createMemoir", [
      "Lorem ipsum dolor sit amet, consectetur adipiscin.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc accumsan sem ut ligula scelerisque, nec porta felis convallis. Proin posuere, tellus et euismod vehicula, risus ante rhoncus leo, auctor elementum est risus sed eiusmod tempor incididunt volup.",
    ]);
    console.log("TX Hash:", txHash);
  };

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
        <div
          onClick={async () => {
            fillAnthology();
          }}
          style={{
            border: "1px solid white",
            padding: "3px",
            borderRadius: "7px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {" "}
          Fill Anthology
        </div>
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
          <Memoirs contractAddr={contractAddr} />
        </>
      )}
    </div>
  );
};
