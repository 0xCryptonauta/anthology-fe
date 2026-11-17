import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ContractSelector } from "./ContractSelector";
import { AddMemoir } from "@components/Anthology/AddMemoir";
import { Address } from "@src/types/common";
import { useAppSelector } from "@src/store/utils/hooks";
import { getBgClass } from "@src/utils/backgrounds";

/* 
  users: string[]; // Array of user addresses
  userContracts: { [key: string]: string[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: string]: string }; // Mapping of contract addresses to contract details (e.g., title)
*/

export const SharePage = () => {
  const [searchParams] = useSearchParams();

  const [selectedContract, setSelectedContract] = useState<Address | "">();

  const title = searchParams.get("title") || undefined;
  const text = searchParams.get("text") || undefined;
  const url = searchParams.get("url") || undefined;
  const sharedContent =
    text && url
      ? text.includes(url)
        ? text
        : `${text}\n${url}`
      : text || url;

  const categoryBackgroundsEnabled = useAppSelector(
    (state) => state.dapp.categoryBackgroundsEnabled
  );
  const backgroundKey = selectedContract || title || url || "share";

  return (
    <div
      className={
        categoryBackgroundsEnabled
          ? `${getBgClass(backgroundKey)} text-shadow-dark`
          : undefined
      }
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        border: "1px solid #30363d",
        width: "100%",
        maxWidth: "420px",
        padding: "16px",
        borderRadius: "12px",
        margin: "5px",
        boxSizing: "border-box",
        backgroundColor: categoryBackgroundsEnabled
          ? "transparent"
          : "#161b22",
      }}
    >
      <ContractSelector
        setSelectedContract={setSelectedContract}
        showUserSelect={false}
      />

      {selectedContract && (
        <AddMemoir
          contractAddr={selectedContract}
          title={title}
          content={sharedContent}
        />
      )}
    </div>
  );
};
