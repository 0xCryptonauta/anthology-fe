import { shortenAddress } from "@src/utils/shortenAddress";
import React, { useState, useMemo } from "react";

interface Contract {
  address: string;
  title: string;
  originalIndex: number;
}

interface Categories {
  [category: string]: {
    items: Contract[];
    subcategories: { [subcategory: string]: Contract[] };
  };
}

interface Props {
  users: string[];
  userContracts: Record<string, string[]>;
  contractsTitles: Record<string, string>;
  setSelectedContract: (addr: string) => void;
}

const ContractSelector: React.FC<Props> = ({
  users,
  userContracts,
  contractsTitles,
  setSelectedContract,
}) => {
  const [selectedUser, setSelectedUser] = useState<string>(users[0] || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const parseContracts = (
    contracts: Contract[]
  ): { categories: Categories; uncategorized: Contract[] } => {
    const categories: Categories = {};
    const uncategorized: Contract[] = [];

    contracts.forEach(({ address, title, originalIndex }) => {
      if (!title.trim()) {
        uncategorized.push({ address, title, originalIndex });
        return;
      }

      const match =
        title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)$/) ||
        title.match(/^([^[]+)$/);

      if (match) {
        const [, category, subcategory, item] =
          match.length === 4 ? match : [null, null, null, match[1]];

        const contractData = {
          address,
          title: item?.trim() || title,
          originalIndex,
        };

        if (category) {
          if (!categories[category]) {
            categories[category] = { items: [], subcategories: {} };
          }

          if (subcategory) {
            if (!categories[category].subcategories[subcategory]) {
              categories[category].subcategories[subcategory] = [];
            }
            categories[category].subcategories[subcategory].push(contractData);
          } else {
            categories[category].items.push(contractData);
          }
        } else {
          uncategorized.push(contractData);
        }
      }
    });

    return { categories, uncategorized };
  };

  const userContractsList = useMemo(() => {
    const contracts = (userContracts[selectedUser] || []).map(
      (address, index) => ({
        address,
        title: contractsTitles[address] || "Untitled",
        originalIndex: index,
      })
    );
    return parseContracts(contracts);
  }, [selectedUser, userContracts, contractsTitles]);

  const categoryOptions = useMemo(() => {
    return ["Other", ...Object.keys(userContractsList.categories)];
  }, [userContractsList.categories]);

  const subcategoryOptions = useMemo(() => {
    if (selectedCategory === "Other") return [];
    return selectedCategory && userContractsList.categories[selectedCategory]
      ? Object.keys(
          userContractsList.categories[selectedCategory].subcategories
        )
      : [];
  }, [selectedCategory, userContractsList.categories]);

  const filteredContracts = useMemo(() => {
    if (selectedCategory === "Other") return userContractsList.uncategorized;
    if (!selectedCategory) return [];
    if (!selectedSubcategory)
      return userContractsList.categories[selectedCategory]?.items || [];
    return (
      userContractsList.categories[selectedCategory]?.subcategories[
        selectedSubcategory
      ] || []
    );
  }, [selectedCategory, selectedSubcategory, userContractsList]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory("");
    setSelectedAddress("");
    setSelectedContract("");
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
    setSelectedAddress("");
    setSelectedContract("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "300px",
        padding: "10px",
        maxWidth: "350px",
      }}
    >
      <label>User: </label>
      <select
        value={selectedUser}
        style={{ minHeight: "30px" }}
        onChange={(e) => {
          setSelectedUser(e.target.value);
          setSelectedCategory("");
          setSelectedSubcategory("");
          setSelectedAddress("");
          setSelectedContract("");
        }}
      >
        {users.map((user) => (
          <option key={user} value={shortenAddress(user, 10, 10)}>
            {shortenAddress(user, 10, 10)}
          </option>
        ))}
      </select>

      <label>Category: </label>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        style={{ minHeight: "30px" }}
      >
        <option value="">No Category</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div
        style={{ minHeight: "40px", display: "flex", flexDirection: "column" }}
      >
        {subcategoryOptions.length > 0 && (
          <>
            <label>Subcategory: </label>

            <select
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              style={{ minHeight: "30px", marginTop: "10px" }}
            >
              <option value="">No subcategory</option>
              {subcategoryOptions.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Memoirs</h3>
        <ul
          style={{
            minHeight: "100px",
            //border: "1px solid #ccc",
            padding: "0px 10px 10px 10px",
          }}
        >
          {filteredContracts.map((contract) => (
            <li
              key={contract.address}
              onClick={() => {
                setSelectedAddress(contract.address);
                setSelectedContract(contract.address);
              }}
              style={{
                cursor: "pointer",
                color: selectedAddress === contract.address ? "gray" : "white",
              }}
            >
              {contract.title}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <label>Anthology Address: </label>
        <input
          type="text"
          value={
            selectedAddress
              ? shortenAddress(selectedAddress, 10, 10)
              : selectedAddress
          }
          readOnly
          style={{ width: "100%", justifyItems: "center" }}
        />
      </div>
    </div>
  );
};

export default ContractSelector;
