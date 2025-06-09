import { useState } from "react";
import { parseEther } from "viem";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
//import { ChangeAnthologyTitle } from "./ChangeAnthologyTitle";
import { useToast } from "@components/Layout/Toast";

import { useAppSelector, useAppDispatch } from "@store/utils/hooks";
import {
  updateAnthologyTitle,
  updateUseBuffer,
  updateUseErc20,
  updateWhitelistEnabled,
} from "@store/slices/anthologySlice";

import { updateOneContractTitle } from "@store/slices/factorySlice";
import { Address } from "@src/types/common";
import { ChangeAnthologyDefaultSkin } from "./ChangeAnthologyDefaultSkin";

export const AnthologyOwner = ({ contractAddr }: { contractAddr: Address }) => {
  const { addToast } = useToast();

  const anthologyState = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr]?.anthologyState : undefined
  );

  const dispatch = useAppDispatch();

  // input fields value
  const [addressToAdd, setAddresToAdd] = useState("");
  const [addressToRemove, setAddressToRemove] = useState("");
  const [erc20TokenAddr, setErc20TokenAddr] = useState("");
  const [memoirPrice, setMemoirPrice] = useState<string>("0");
  const [newMaxMemoirs, setNewMaxMemoirs] = useState("");
  const [newTitle, setNewTitle] = useState("");

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
        margin: "20px 5px",
      }}
    >
      <h2>Anthology Owner</h2>
      {/* ------------------------------- Update Anthology title ------------------------------ */}
      <div
        style={{
          border: "1px solid white",
          padding: "5px",
          borderRadius: "7px",
          margin: "3px",
        }}
      >
        <input
          placeholder="New title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        ></input>
        <span
          style={{ marginLeft: "7px" }}
          onClick={async () => {
            try {
              const txHash = await writeAnthology(contractAddr, "setTitle", [
                [newTitle],
              ]);
              if (txHash) {
                addToast({
                  title: "New title:",
                  content: newTitle,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateAnthologyTitle({
                    contract: contractAddr,
                    title: newTitle,
                  })
                );
                dispatch(
                  updateOneContractTitle({
                    contract: contractAddr,
                    title: newTitle,
                  })
                );
              }
            } catch (error) {
              addToast({
                title: "Error setting new title",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting new title", error);
            }
          }}
        >
          🔄
        </span>
      </div>

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
            try {
              //Check first if users include address before call
              const txHash = await writeAnthology(
                contractAddr,
                "setMemoirPrice",
                [parseEther(memoirPrice)]
              );
              console.log("updating price", txHash);
              if (txHash) {
                addToast({
                  title: "New price:",
                  content: memoirPrice,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error setting new price",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting new price", error);
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
              const txHash = await writeAnthology(contractAddr, "setUseERC20", [
                !anthologyState?.useERC20,
              ]);
              if (txHash) {
                addToast({
                  title: "Payment method changed to:",
                  content: !anthologyState?.useERC20 + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateUseErc20({
                    contract: contractAddr,
                    useERC20: !anthologyState?.useERC20,
                  })
                );
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
            try {
              //Check first if users include address before call
              const txHash = await writeAnthology(
                contractAddr,
                "setERC20Token",
                [erc20TokenAddr]
              );
              if (txHash) {
                addToast({
                  title: "ERC20 address set to:",
                  content: erc20TokenAddr + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error setting new price",
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
              const txHash = await writeAnthology(
                contractAddr,
                "enableWhitelist",
                [!anthologyState?.whitelistEnabled]
              );
              if (txHash) {
                addToast({
                  title: "Whitelist has been:",
                  content: !anthologyState?.whitelistEnabled
                    ? "Activated"
                    : "Disabled" + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateWhitelistEnabled({
                    contract: contractAddr,
                    whitelistEnabled: !anthologyState?.whitelistEnabled,
                  })
                );
              }
            } catch (error) {
              addToast({
                title: "error setting whitelist",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting whitelist", error);
            }
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

            try {
              const txHash = await writeAnthology(
                contractAddr,
                "addToWhitelist",
                [addressToAdd]
              );
              if (txHash) {
                addToast({
                  title: "Address added to whitelist",
                  content: addressToAdd + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error addng to whitelist",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error adding to whitelist", error);
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
              //Check first if users include address before call
              const txHash = await writeAnthology(
                contractAddr,
                "removeFromWhitelist",
                [addressToRemove]
              );
              if (txHash) {
                addToast({
                  title: "Address removed from whitelist",
                  content: addressToRemove + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error removing from whitelist",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error removing from whitelist", error);
            }
          }}
        >
          📤
        </span>
      </div>

      {/* ----------------------------------- Set useBuffer ------------------------------------ */}

      <div>
        <button
          onClick={async () => {
            try {
              const txHash = await writeAnthology(
                contractAddr,
                "setUseBuffer",
                [!anthologyState?.useBuffer]
              );
              if (txHash) {
                addToast({
                  title: "Buffer has been:",
                  content: !anthologyState?.useBuffer
                    ? "Activated"
                    : "Disabled" + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateUseBuffer({
                    contract: contractAddr,
                    useBuffer: !anthologyState?.useBuffer,
                  })
                );
              }
            } catch (error) {
              addToast({
                title: "Error updating buffer status",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting buffer status", error);
            }
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
            try {
              //Check first if users include address before call
              const txHash = await writeAnthology(
                contractAddr,
                "setMaxMemoirs",
                [newMaxMemoirs]
              );
              if (txHash) {
                addToast({
                  title: "New max number of memoirs:",
                  content: newMaxMemoirs + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error setting new maxMemoirs",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting new maxMemoirs", error);
            }
          }}
        >
          💰
        </span>
      </div>

      {/* ------------------------------- setDefaultSkin ------------------------------ */}

      <ChangeAnthologyDefaultSkin contractAddr={contractAddr} />

      {/* ----------------------------------- cleanMemoirs ------------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            try {
              const txHash = await writeAnthology(contractAddr, "cleanMemoirs");
              if (txHash) {
                addToast({
                  title: "Cleaning memoirs",
                  content: "txHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error cleaning memoirs",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error cleaning memoirs", error);
            }
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
            try {
              const txHash = await writeAnthology(
                contractAddr,
                "cleanMemoirBuffer"
              );
              if (txHash) {
                addToast({
                  title: "Cleaning memoir buffer",
                  content: "txHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error cleaning memoirs buffer",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error cleaning memoirs buffer", error);
            }
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
            try {
              const txHash = await writeAnthology(
                contractAddr,
                "cleanWhitelist"
              );
              if (txHash) {
                addToast({
                  title: "Cleaning whitelist",
                  content: "txHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error cleaning whitelist",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error cleaning whitelist", error);
            }
          }}
        >
          Clean Whitelist
        </button>
      </div>
    </div>
  );
};
