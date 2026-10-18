import { useState } from "react";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { transformData } from "@utils/transformData";
import { useTranslation } from "@src/i18n/useTranslation";

export const GetUserContracts = () => {
  const { t } = useTranslation();
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
          aria-label="User Address"
          value={userToGetContract}
          onChange={(event) => {
            setUserToGetContract(event.target.value);
          }}
        ></input>
      </div>

      <button
        type="button"
        className="icon-button"
        style={{ marginLeft: "7px" }}
        aria-label={t("selector.user")}
        title={t("selector.user")}
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
      </button>
    </div>
  );
};
