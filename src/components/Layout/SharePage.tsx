import { useAppSelector } from "@src/store/utils/hooks";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ContractSelector from "./ContractSelector";
import { AddMemoir } from "@components/Anthology/AddMemoir";

/* 
  users: string[]; // Array of user addresses
  userContracts: { [key: string]: string[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: string]: string }; // Mapping of contract addresses to contract details (e.g., title)
*/

export const SharePage = () => {
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );
  const [searchParams] = useSearchParams();

  const [selectedContract, setSelectedContract] = useState("");

  const title = searchParams.get("title") || undefined;
  const text = searchParams.get("text") || undefined;
  console.log("selected:", selectedContract);
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
      <ContractSelector
        users={users}
        userContracts={userContracts}
        contractsTitles={contractsTitles}
        setSelectedContract={setSelectedContract}
      />
      {selectedContract && (
        <AddMemoir
          contractAddr={selectedContract}
          title={title}
          content={text}
        />
      )}
    </div>
  );
};
