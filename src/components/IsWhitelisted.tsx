import { useState } from "react";
//import { readFactory } from "./FactoryFunctions";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export const IsWhitelisted = () => {
  const { whitelistedUsers } = useSelector((state: RootState) => state.factory);

  const [addressToCheck, setAddressToCheck] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | undefined>(
    undefined
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
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
          placeholder="Check address"
          value={addressToCheck}
          onChange={(event) => {
            setAddressToCheck(event.target.value);
            if (isWhitelisted != undefined) {
              setIsWhitelisted(undefined);
            }
          }}
        ></input>
        {isWhitelisted != undefined && (
          <span
            style={{
              fontSize: "10px",
              color: isWhitelisted ? "green" : "red",
            }}
          >
            {isWhitelisted
              ? "address is whitelisted"
              : "addres is NOT whitelisted"}
          </span>
        )}
      </div>

      <span
        style={{ marginLeft: "7px", cursor: "pointer" }}
        onClick={async () => {
          //const isWl = await readFactory("isWhitelisted", [addressToCheck]);
          const isWl = whitelistedUsers.includes(addressToCheck);
          setIsWhitelisted(isWl as boolean);
          console.log("isWhitelisted:", isWhitelisted);
        }}
      >
        🔎
      </span>
    </div>
  );
};
