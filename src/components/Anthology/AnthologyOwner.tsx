import { useState } from "react";
/* import {
  callAddToWhitelist,
  callSetIsFrozen,
  callSetUseERC20,
  callEnableWhitelist,
  callRemoveFromWhitelist,
  callSetERC20Token,
  callSetAnthologyPrice,
} from "../FactoryFunctions"; */
import { parseEther } from "viem";
import { writeAnthology } from "../ContractFunctions/AnthologyFunctions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ChangeAnthologyTitle } from "./ChangeAnthologyTitle";

/* import { useSelector, useDispatch } from "react-redux";
import {
  updateAddToWhitelist,
  updateAnthologyPrice,
  updateErc20Token,
  updateIsFrozen,
  updateRemoveFromWhitelist,
  updateUseErc20,
  updateWhitelistEnabled,
} from "../../slices/factorySlice";
import { RootState } from "../../store"; */

export const AnthologyOwner = ({ contractAddr }: { contractAddr: string }) => {
  const anthologyState = useSelector((state: RootState) =>
    contractAddr ? state.anthology[contractAddr]?.anthologyState : undefined
  );

  //const dispatch = useDispatch();

  /* const { isFrozen, whitelistEnabled, useErc20 } = useSelector(
    (state: RootState) => state.factory
  ); */

  // input fields value
  const [addressToAdd, setAddresToAdd] = useState("");
  const [addressToRemove, setAddressToRemove] = useState("");
  const [erc20TokenAddr, setErc20TokenAddr] = useState("");
  const [memoirPrice, setMemoirPrice] = useState<string>("0");
  const [newMaxMemoirs, setNewMaxMemoirs] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <h2>Anthology Owner</h2>

      <ChangeAnthologyTitle contractAddr={contractAddr} />

      {/* ------------------------------- Update Anthology price ------------------------------ */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Set new anthology price</span>
          <input
            type="number"
            placeholder="Add address to WL"
            value={memoirPrice}
            onChange={(event) => {
              setMemoirPrice(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>

        <span
          style={{ marginLeft: "7px", cursor: "pointer" }}
          onClick={async () => {
            //Check first if users include address before call
            const txHash = await writeAnthology(
              contractAddr,
              "setMemoirPrice",
              [parseEther(memoirPrice)]
            );
            console.log("updating price", txHash);
            //if (txHash) dispatch(updateAnthologyPrice(Number(anthologyPrice)));
          }}
        >
          💰
        </span>
      </div>

      {/* ---------------------------------- Toggle useERC20 ---------------------------------- */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            const txHash = await writeAnthology(contractAddr, "setUseERC20", [
              !anthologyState?.useERC20,
            ]);

            console.log("setting useERC20: ", txHash);
            //if (txHash) dispatch(updateUseErc20(!useErc20));
          }}
        >
          {anthologyState && anthologyState.useERC20
            ? "Change to ETH payment"
            : "Change to ERC20 payment"}
        </button>
      </div>

      {/* ----------------------------------- setERC20Token ----------------------------------- */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Set ERC20 token Address</span>
          <input
            type="text"
            placeholder="ERC20 Address"
            value={erc20TokenAddr}
            onChange={(event) => {
              setErc20TokenAddr(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>

        <span
          style={{ marginLeft: "7px", cursor: "pointer" }}
          onClick={async () => {
            //Check first if users include address before call
            const txHash = await writeAnthology(contractAddr, "setERC20Token", [
              erc20TokenAddr,
            ]);
            console.log("updating ERC20 token addr", txHash);
            //if (txHash) dispatch(updateErc20Token(erc20TokenAddr));
          }}
        >
          📝
        </span>
      </div>

      {/* ---------------------------------- Toggle whitelist --------------------------------- */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            const txHash = await writeAnthology(
              contractAddr,
              "enableWhitelist",
              [!anthologyState?.whitelistEnabled]
            );
            console.log("enable whitelist (TOAST):", txHash);
            //if (txHash) dispatch(updateWhitelistEnabled(!whitelistEnabled));
          }}
        >
          {anthologyState && anthologyState?.whitelistEnabled
            ? "Deactivate whitelist"
            : "Activate Whitelist"}
        </button>
      </div>

      {/* ---------------------------------- Add to Whitelist --------------------------------- */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Add address to WL"
            value={addressToAdd}
            onChange={(event) => {
              setAddresToAdd(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>

        <span
          style={{ marginLeft: "7px", cursor: "pointer" }}
          onClick={async () => {
            //Check first if users include address before call
            const txHash = await writeAnthology(
              contractAddr,
              "addToWhitelist",
              [addressToAdd]
            );
            console.log("Adding to WL: confirm in toast", txHash);
            //if (txHash) dispatch(updateAddToWhitelist(addressToAdd));
          }}
        >
          📥
        </span>
      </div>

      {/* -------------------------------- Remove From Whitelist ------------------------------ */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Remove from WL"
            value={addressToRemove}
            onChange={(event) => {
              setAddressToRemove(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>

        <span
          style={{ marginLeft: "7px", cursor: "pointer" }}
          onClick={async () => {
            //Check first if users include address before call
            const txHash = await writeAnthology(
              contractAddr,
              "removeFromWhitelist",
              [addressToRemove]
            );
            console.log("Removing from WL: confirm in toast", txHash);
            //if (txHash) dispatch(updateRemoveFromWhitelist(addressToRemove));
          }}
        >
          📤
        </span>
      </div>

      {/* ----------------------------------- Set useBuffer ------------------------------------ */}

      <div>
        <button
          onClick={async () => {
            const txHash = await writeAnthology(contractAddr, "setUseBuffer", [
              !anthologyState?.useBuffer,
            ]);
            console.log("Updating useBuffer:", txHash);
            //if (txHash) dispatch(updateIsFrozen(_newValue));
          }}
        >
          <span>
            {anthologyState?.useBuffer
              ? "Deactivate buffer"
              : "Activate buffer"}
          </span>
        </button>
      </div>
      {/* ----------------------------------- Set isFrozen ------------------------------------ */}

      {/* <div>
        <button
          onClick={async () => {
            const _newValue = !isFrozen;
            const txHash = await callSetIsFrozen(_newValue);
            console.log("Updating isFrozen:", txHash);
            if (txHash) dispatch(updateIsFrozen(_newValue));
          }}
        >
          <span>{isFrozen ? "Unfreeze contract" : "Freeze contract"}</span>
        </button>
      </div> */}

      {/* ------------------------------- setMaxMemoirs ------------------------------ */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          border: "1px solid white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Set new maxMemoirs</span>
          <input
            type="number"
            placeholder="new max memoir"
            value={newMaxMemoirs}
            onChange={(event) => {
              setNewMaxMemoirs(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>

        <span
          style={{ marginLeft: "7px", cursor: "pointer" }}
          onClick={async () => {
            //Check first if users include address before call
            const txHash = await writeAnthology(contractAddr, "setMaxMemoirs", [
              newMaxMemoirs,
            ]);
            console.log("updating maxMemoirs", txHash);
            //if (txHash) dispatch(updateAnthologyPrice(Number(anthologyPrice)));
          }}
        >
          💰
        </span>
      </div>

      {/* ----------------------------------- cleanMemoirs ------------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            const txHash = await writeAnthology(contractAddr, "cleanMemoirs");

            console.log("Cleaning memoirs: ", txHash);
            //if (txHash) dispatch(updateUseErc20(!useErc20));
          }}
        >
          Clean Memoirs
        </button>
      </div>

      {/* ----------------------------------- cleanMemoirBuffer ------------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            const txHash = await writeAnthology(
              contractAddr,
              "cleanMemoirBuffer"
            );

            console.log("Cleaning memoirBuffer: ", txHash);
            //if (txHash) dispatch(updateUseErc20(!useErc20));
          }}
        >
          Clean Buffer
        </button>
      </div>

      {/* ----------------------------------- cleanWhitelist ------------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            const txHash = await writeAnthology(contractAddr, "cleanWhitelist");

            console.log("Cleaning whitelist: ", txHash);
            //if (txHash) dispatch(updateUseErc20(!useErc20));
          }}
        >
          Clean Whitelist
        </button>
      </div>
    </div>
  );
};
