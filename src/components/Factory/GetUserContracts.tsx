import { useState } from "react";
import { readFactory } from "../../contract-functions/FactoryFunctions";
import { transformData } from "../../utils/transformData";

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
          const userDB = await readFactory("getUsersContractsWithTitles", [
            [userToGetContract],
          ]);

          const { userContracts, titles } = transformData(
            userDB as string[][][],
            [userToGetContract] as string[]
          );

          /*           const titles = await readTitles(
            userContracts.length > 1 ? [userContracts] : userContracts
          ); */
          console.log("titles:", titles);
          console.log("contracts:", userContracts);
        }}
      >
        🔎
      </span>
    </div>
  );
};
