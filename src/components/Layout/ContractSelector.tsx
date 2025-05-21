import { shortenAddress } from "@src/utils/shortenAddress";
import React, { useState, useMemo } from "react";
import { parseContractsCategories } from "@src/utils/parseContractsCategories";
import { Address } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useAppSelector } from "@src/store/utils/hooks";
interface ContractSelectorProps {
  setSelectedContract: (addr: Address) => void;
}

export const ContractSelector: React.FC<ContractSelectorProps> = ({
  setSelectedContract,
}) => {
  const [selectedUser, setSelectedUser] = useState<Address>(
    LOCAL_USER_ADDR || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const localContracts = useAppSelector(
    (state) => state.localAnthology.userContracts[LOCAL_USER_ADDR]
  );
  const localTitles = useAppSelector(
    (state) => state.localAnthology.contractsTitles
  );
  const isLocalUser = selectedUser === LOCAL_USER_ADDR;

  const userContractsList = useMemo(() => {
    const currentContracts = isLocalUser
      ? localContracts
      : userContracts[selectedUser] || [];

    const contracts = currentContracts.map((address, index) => ({
      address,
      title: isLocalUser
        ? localTitles[address]
        : contractsTitles[address] || "Untitled",
      originalIndex: index,
    }));
    return parseContractsCategories(contracts);
  }, [
    contractsTitles,
    localTitles,
    localContracts,
    isLocalUser,
    userContracts,
    selectedUser,
  ]);

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
    setSelectedContract("0x");
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
    setSelectedAddress("");
    setSelectedContract("0x");
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
          setSelectedUser(e.target.value as Address);
          setSelectedCategory("");
          setSelectedSubcategory("");
          setSelectedAddress("");
          setSelectedContract("0x");
        }}
      >
        <option key={"localUser"} value={LOCAL_USER_ADDR}>
          Local User
        </option>
        {users.map((user) => (
          <option key={user} value={user}>
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
        {/* <option value="">No Category</option> */}
        {selectedUser === LOCAL_USER_ADDR
          ? categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))
          : categoryOptions.map((category) => (
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
                setSelectedContract(contract.address as Address);
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
