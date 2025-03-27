import { useState } from "react";
import { writeAnthology } from "@contract-functions/AnthologyFunctions";

export const ChangeAnthologyTitle = ({
  contractAddr,
}: {
  contractAddr: string;
}) => {
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
        placeholder="New title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      ></input>
      <span
        style={{ marginLeft: "7px" }}
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
      </span>
    </div>
  );
};
