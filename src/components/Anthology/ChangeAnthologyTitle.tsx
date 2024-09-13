import { useState } from "react";
import { writeAnthology } from "../ContractFunctions/AnthologyFunctions";

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
      <button
        onClick={async () => {
          const txHash_setTitle = await writeAnthology(
            contractAddr,
            "setTitle",
            [[newTitle]]
          );
          console.log("txHash setTitle", txHash_setTitle);
        }}
      >
        {" "}
        Change Title
      </button>
    </div>
  );
};
