import { useState } from "react";
//import { readFactory } from "./FactoryFunctions";
import { useAppSelector } from "@store/utils/hooks";
import { useTranslation } from "@src/i18n/useTranslation";

export const IsWhitelisted = () => {
  const { t } = useTranslation();
  const { whitelistedUsers } = useAppSelector((state) => state.factory);

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
          placeholder={t("a11y.checkAddress")}
          aria-label={t("a11y.checkAddress")}
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
            role="status"
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

      <button
        type="button"
        className="icon-button"
        style={{ marginLeft: "7px" }}
        aria-label={t("a11y.checkAddress")}
        title={t("a11y.checkAddress")}
        onClick={async () => {
          //const isWl = await readFactory("isWhitelisted", [addressToCheck]);
          const isWl = whitelistedUsers.includes(addressToCheck);
          setIsWhitelisted(isWl as boolean);
          console.log("isWhitelisted:", isWhitelisted);
        }}
      >
        🔎
      </button>
    </div>
  );
};
