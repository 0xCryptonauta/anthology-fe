import { useState } from "react";
import {
  callAddToWhitelist,
  callSetIsFrozen,
  callSetUseERC20,
  callEnableWhitelist,
  callRemoveFromWhitelist,
  callSetERC20Token,
  callSetAnthologyPrice,
} from "./FactoryFunctions";
import { parseEther } from "viem";

import { useSelector, useDispatch } from "react-redux";
import {
  updateAddToWhitelist,
  updateAnthologyPrice,
  updateErc20Token,
  updateIsFrozen,
  updateRemoveFromWhitelist,
  updateUseErc20,
  updateWhitelistEnabled,
} from "../slices/factorySlice";
import { RootState } from "../store";

export const OnlyOwner = () => {
  const dispatch = useDispatch();

  const { isFrozen, whitelistEnabled, useErc20 } = useSelector(
    (state: RootState) => state.factory
  );

  // input fields value
  const [addressToAdd, setAddresToAdd] = useState("");
  const [addressToRemove, setAddressToRemove] = useState("");
  const [erc20TokenAddr, setErc20TokenAddr] = useState("");
  const [anthologyPrice, setAnthologyPrice] = useState<string>("0");

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
      <h2>Owner only:</h2>

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
            value={anthologyPrice}
            onChange={(event) => {
              setAnthologyPrice(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>

        <span
          style={{ marginLeft: "7px", cursor: "pointer" }}
          onClick={async () => {
            //Check first if users include address before call
            const txHash = await callSetAnthologyPrice(
              parseEther(anthologyPrice)
            );
            console.log("updating price", txHash);
            if (txHash) dispatch(updateAnthologyPrice(Number(anthologyPrice)));
          }}
        >
          💰
        </span>
      </div>

      {/* ---------------------------------- Toggle useERC20 ---------------------------------- */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            const txHash = await callSetUseERC20(!useErc20);

            console.log("setting useERC20: ", txHash);
            if (txHash) dispatch(updateUseErc20(!useErc20));
          }}
        >
          {useErc20 ? "Change to ETH payment" : "Change to ERC20 payment"}
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
          {/* Change for a dropdown with most used ERC20 token no input -> selector */}
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
            const txHash = await callSetERC20Token(erc20TokenAddr);
            console.log("updating ERC20 token addr", txHash);
            if (txHash) dispatch(updateErc20Token(erc20TokenAddr));
          }}
        >
          📝
        </span>
      </div>

      {/* ---------------------------------- Toggle whitelist --------------------------------- */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            const txHash = await callEnableWhitelist(!whitelistEnabled);
            console.log("enable whitelist (TOAST):", txHash);
            if (txHash) dispatch(updateWhitelistEnabled(!whitelistEnabled));
          }}
        >
          {whitelistEnabled ? "Deactivate whitelist" : "Activate Whitelist"}
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
            const txHash = await callAddToWhitelist(addressToAdd);
            console.log("Adding to WL: confirm in toast", txHash);
            if (txHash) dispatch(updateAddToWhitelist(addressToAdd));
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
            const txHash = await callRemoveFromWhitelist(addressToRemove);
            console.log("Removing from WL: confirm in toast", txHash);
            if (txHash) dispatch(updateRemoveFromWhitelist(addressToRemove));
          }}
        >
          📤
        </span>
      </div>

      {/* ----------------------------------- Set isFrozen ------------------------------------ */}

      <div>
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
      </div>
    </div>
  );
};
