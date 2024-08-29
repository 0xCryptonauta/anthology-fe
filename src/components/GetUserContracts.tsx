import { useState } from "react";
import { readFactory } from "./FactoryFunctions";

export const GetUserContracts = () => {
  const [userToGetContract, setUserToGetContract] = useState("");
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
          placeholder="User Address"
          value={userToGetContract}
          onChange={(event) => {
            setUserToGetContract(event.target.value);
          }}
        ></input>
      </div>

      <span
        style={{ marginLeft: "7px", cursor: "pointer" }}
        onClick={async () => {
          const userContracts = await readFactory("getUserContracts", [
            userToGetContract,
          ]);
          console.log("usersContracts:", userContracts);
        }}
      >
        🔎
      </span>
    </div>
  );
};
