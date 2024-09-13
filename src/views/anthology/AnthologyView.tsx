import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { readAnthology } from "../../components/ContractFunctions/AnthologyFunctions";

import {
  addAnthology,
  updateAnthologyState,
  AnthologyInfoInterface,
  MemoirInterface,
  updateMemoirs,
  updateWhitelist,
  updateMemoirBuffer,
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
    const callAnthology = async () => {
      const anthologyInfo = await fetchAnthologyInfo(contractAddr);

      if (ethAddr && contractAddr) {
        if (!anthology) {
          console.log("New anthology added");
          dispatch(
            addAnthology({
              contract: contractAddr,
              anthologyInfo: anthologyInfo as AnthologyInfoInterface,
            })
          );
        } else {
          console.log("Existing anthology updated");
          dispatch(
            updateAnthologyState({
              contract: contractAddr,
              anthologyInfo: anthologyInfo as AnthologyInfoInterface,
            })
          );
        }

        if (anthology?.anthologyState.memoirsCP != anthologyInfo?.memoirsCP) {
          const _memoirs = (await readAnthology(
            contractAddr,
            "getMemoirs"
          )) as MemoirInterface[];

          const memoirsString = _memoirs.map((memoir) => ({
            ...memoir,
            timestamp: memoir.timestamp.toString(),
          }));

          console.log("CAlling memoirs");

          dispatch(
            updateMemoirs({
              contract: contractAddr,
              memoirs: memoirsString,
            })
          );
        }

        if (
          anthologyInfo.whitelistEnabled &&
          anthology?.anthologyState.whitelistCP != anthologyInfo?.whitelistCP
        ) {
          const whitelistedUsers = await readAnthology(
            contractAddr,
            "getWhitelist"
          );
          console.log("CAlling whitelist");
          dispatch(
            updateWhitelist({
              contract: contractAddr,
              whitelistedUsers: whitelistedUsers as string[],
            })
          );
        }

        if (
          anthologyInfo.owner == userAddr &&
          anthologyInfo.useBuffer &&
          anthology?.anthologyState.memoirBufferCP !=
            anthologyInfo?.memoirBufferCP
        ) {
          const memoirBuffer = (await readAnthology(
            contractAddr,
            "getMemoirBuffer"
          )) as MemoirInterface[];

          const memoirBufferString = memoirBuffer.map((memoir) => ({
            ...memoir,
            timestamp: memoir.timestamp.toString(),
          }));

          console.log("CAlling memoirBuffer");
          dispatch(
            updateMemoirBuffer({
              contract: contractAddr,
              memoirBuffer: memoirBufferString,
            })
          );
        }
      }
    };

    //Validate if contract already exist before making rpc call
    if (contractAddr && !anthology) callAnthology();
  }, [contractAddr, userContracts, dispatch, ethAddr, anthology, userAddr]);

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
      <h3>{contractTitle}</h3>
      <span>Anthology Address: {contractAddr}</span>
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
            {!sudoMode ? (
              <>
                <AnthologyState />
                {anthology?.anthologyState.whitelistEnabled && (
                  <AnthologyWhitelistedUsers contractAddr={contractAddr} />
                )}
              </>
            ) : (
              <>
                {userAddr === anthology?.anthologyState.owner && (
                  <>
                    <AnthologyOwner contractAddr={contractAddr} />
                    <MemoirBuffer contractAddr={contractAddr} />{" "}
                    {/* remove button and leave it to CP */}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <AddMemoir contractAddr={contractAddr} />
          <Memoirs contractAddr={contractAddr} />
        </>
      )}
    </div>
  );
};
