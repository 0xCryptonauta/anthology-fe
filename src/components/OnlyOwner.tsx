import { useEffect, useState } from "react";
import {
  addToWhitelist,
  callSetIsFrozen,
  callSetUseERC20,
  enableWhitelist,
  readFactory,
  removeFromWhitelist,
  setERC20Token,
  updateAnthologyPrice,
} from "./FactoryFunctions";
import { parseEther } from "viem";

export const OnlyOwner = () => {
  const [useERC20, setUseERC20] = useState(false);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [addressToAdd, setAddresToAdd] = useState("");
  const [addressToRemove, setAddressToRemove] = useState("");
  const [anthologyPrice, setAnthologyPrice] = useState("");
  const [erc20TokenAddr, setErc20TokenAddr] = useState("");
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const fetchUseERC20 = async () => {
      const _useERC20 = await readFactory("useERC20");
      const _whitelistEnabled = await readFactory("whitelistEnabled");
      const _isFrozen = await readFactory("isFrozen");

      setUseERC20(_useERC20 as boolean);
      setWhitelistEnabled(_whitelistEnabled as boolean);
      setIsFrozen(_isFrozen as boolean);
    };

    fetchUseERC20();
  }, []);

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

      {/* ------------------------------ Update Anthology price ------------------------------ */}
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
            const txResponse = await updateAnthologyPrice(
              parseEther(anthologyPrice)
            );
            console.log("updating price", txResponse);
          }}
        >
          💰
        </span>
      </div>

      {/* ------------------------------ Toggle useERC20 ------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button onClick={async () => await callSetUseERC20(!useERC20)}>
          {useERC20 ? "Change to ETH payment" : "Change to ERC20 payment"}
        </button>
      </div>

      {/* ------------------------------- setERC20Token ------------------------------- */}

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
            const txResponse = await setERC20Token(erc20TokenAddr);
            console.log("updating ERC20 token addr", txResponse);
          }}
        >
          📝
        </span>
      </div>

      {/* ------------------------------ Toggle whitelist ------------------------------ */}

      <div style={{ margin: "5px" }}>
        <button
          onClick={async () => {
            await enableWhitelist(!whitelistEnabled);
          }}
        >
          {whitelistEnabled ? "Deactivate whitelist" : "Activate Whitelist"}
        </button>
      </div>
      {/* ------------------------------ Add to Whitelist ------------------------------ */}
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
            const txResponse = await addToWhitelist(addressToAdd);
            console.log("Adding to WL: confirm in toast", txResponse);
          }}
        >
          📥
        </span>
      </div>

      {/* ------------------------------ Remove From Whitelist ------------------------------ */}

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
            const txResponse = await removeFromWhitelist(addressToRemove);
            console.log("Removing from WL: confirm in toast", txResponse);
          }}
        >
          📤
        </span>
      </div>

      {/*  */}

      <div>
        <button onClick={async () => await callSetIsFrozen(!isFrozen)}>
          <span>{isFrozen ? "Unfreeze" : "Freeze"}</span>
        </button>
      </div>
    </div>
  );
};
