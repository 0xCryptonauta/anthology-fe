import { useState } from "react";
import { writeAnthology } from "../ContractFunctions/AnthologyFunctions";

export const AddMemoir = ({ contractAddr }: { contractAddr: string }) => {
  const [anthologyTitle, setAnthologyTitle] = useState("");
  const [anthologyContent, setAnthologyContent] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
      }}
    >
      <span>Title:</span>
      <input
        placeholder=""
        value={anthologyTitle}
        onChange={(e) => {
          setAnthologyTitle(e.target.value);
        }}
      ></input>
      <br />
      <span>Content:</span>
      <textarea
        value={anthologyContent}
        onChange={(e) => {
          setAnthologyContent(e.target.value);
        }}
      ></textarea>
      <button
        onClick={async () => {
          const txHash_setTitle = await writeAnthology(
            contractAddr,
            "createMemoir",
            [anthologyTitle, anthologyContent]
          );
          console.log("txHash created", txHash_setTitle);
        }}
      >
        Add Memoir
      </button>
    </div>
  );
};
