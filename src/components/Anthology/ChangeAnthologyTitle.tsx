import { useState } from "react";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { Address } from "@src/types/common";
import { useTranslation } from "@src/i18n/useTranslation";

export const ChangeAnthologyTitle = ({
  contractAddr,
}: {
  contractAddr: Address;
}) => {
  const { t } = useTranslation();
  const [newTitle, setNewTitle] = useState("");

  return (
    <div
      style={{
        border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
      }}
    >
      <input
        placeholder={t("owner.setNewTitle")}
        aria-label={t("owner.setNewTitle")}
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      ></input>
      <button
        type="button"
        className="icon-button"
        style={{ marginLeft: "7px" }}
        aria-label={t("owner.changeTitle")}
        title={t("owner.changeTitle")}
        onClick={async () => {
          const txHash_setTitle = await writeAnthology(
            contractAddr,
            "setTitle",
            [[newTitle]]
          );
          console.log("txHash setTitle", txHash_setTitle);
        }}
      >
        🔄
      </button>
    </div>
  );
};
