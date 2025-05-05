import { useState } from "react";
import { writeFactory } from "@contract-functions/FactoryFunctions";
import { parseEther } from "viem";

import { useAppSelector, useAppDispatch } from "@store/utils/hooks";
import {
  updateAddToWhitelist,
  updateAnthologyPrice,
  updateErc20Token,
  updateIsFrozen,
  updateRemoveFromWhitelist,
  updateUseErc20,
  updateWhitelistEnabled,
} from "@store/slices/factorySlice";

import { useToast } from "@components/Layout/Toast";

export const OnlyOwner = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const { isFrozen, whitelistEnabled, useErc20 } = useAppSelector(
    (state) => state.factory
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
            try {
              //Check first if users include address before call
              const txHash = await writeFactory("setAnthologyPrice", [
                parseEther(anthologyPrice),
              ]);
              if (txHash) {
                addToast({
                  title: "New anthology price:",
                  content: anthologyPrice + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateAnthologyPrice(Number(anthologyPrice)));
              }
            } catch (error) {
              addToast({
                title: "Error setting anthology price",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting anthology price", error);
            }
          }}
        >
          💰
        </span>
      </div>

      {/* ---------------------------------- Toggle useERC20 ---------------------------------- */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            try {
              const txHash = await writeFactory("setUseERC20", [!useErc20]);
              if (txHash) {
                addToast({
                  title: "Anthology now uses",
                  content: !useErc20
                    ? "ETH"
                    : "ERC20" + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateUseErc20(!useErc20));
              }
            } catch (error) {
              addToast({
                title: "Error setting ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting", error);
            }
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
            try {
              const txHash = await writeFactory("setERC20Token", [
                erc20TokenAddr,
              ]);
              if (txHash) {
                addToast({
                  title: "New ERC20 address",
                  content: erc20TokenAddr + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateErc20Token(erc20TokenAddr));
              }
            } catch (error) {
              addToast({
                title: "Error setting erc20 address",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting erc20 address", error);
            }
          }}
        >
          📝
        </span>
      </div>

      {/* ---------------------------------- Toggle whitelist --------------------------------- */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            try {
              const txHash = await writeFactory("enableWhitelist", [
                !whitelistEnabled,
              ]);
              if (txHash) {
                addToast({
                  title: "Whitelist has been:",
                  content: !whitelistEnabled
                    ? "Activated"
                    : "Disabled" + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateWhitelistEnabled(!whitelistEnabled));
              }
            } catch (error) {
              addToast({
                title: "Error enabling whitelist ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error enabling whitelist", error);
            }
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
            try {
              const txHash = await writeFactory("addToWhitelist", [
                addressToAdd,
              ]);
              if (txHash) {
                addToast({
                  title: "Address added to whitelist",
                  content: addressToAdd + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateAddToWhitelist(addressToAdd));
              }
            } catch (error) {
              addToast({
                title: "Error adding addr to whitelist ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error adding addr to whitelist", error);
            }
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
            try {
              const txHash = await writeFactory("removeFromWhitelist", [
                addressToRemove,
              ]);
              if (txHash) {
                addToast({
                  title: "Address removed from whitelist",
                  content: addressToRemove + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateRemoveFromWhitelist(addressToRemove));
              }
            } catch (error) {
              addToast({
                title: "Error removing address from whitelist ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error removing address from whitelist", error);
            }
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

            try {
              const txHash = await writeFactory("setIsFrozen", [_newValue]);
              if (txHash) {
                addToast({
                  title: "Factory is",
                  content: _newValue
                    ? "Active"
                    : "Frozen" + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateIsFrozen(_newValue));
              }
            } catch (error) {
              addToast({
                title: "Error setting ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting", error);
            }
          }}
        >
          <span>{isFrozen ? "Unfreeze contract" : "Freeze contract"}</span>
        </button>
      </div>

      {/* ----------------------------------- cleanUsers ------------------------------------ */}

      {/*  <div style={{ margin: "5px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            const txHash = await writeFactory("cleanUsers");

            console.log("Cleaning users: ", txHash);
            //if (txHash) dispatch(updateUseErc20(!useErc20));
                        try {
              if (txHash) {
                addToast({
                  title: "New anthology price:",
                  content: anthologyPrice + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error setting ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting", error);
            }
          }}
        >
          Clean Users
        </button>
      </div> */}

      {/* ----------------------------------- cleanWhitelist ------------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            try {
              const txHash = await writeFactory("cleanWhitelist");
              if (txHash) {
                addToast({
                  title: "New anthology price:",
                  content: anthologyPrice + "\n\n TxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(updateUseErc20(!useErc20));
              }
            } catch (error) {
              addToast({
                title: "Error setting ",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting", error);
            }
          }}
        >
          Clean whitelist
        </button>
      </div>
    </div>
  );
};
