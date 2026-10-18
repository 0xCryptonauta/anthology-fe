import { shortenAddress } from "@src/utils/shortenAddress";
import React, { useState, useMemo, useId } from "react";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import { Address } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useAppSelector } from "@src/store/utils/hooks";
import { useTranslation } from "@src/i18n/useTranslation";
interface ContractSelectorProps {
  setSelectedContract: (addr: Address | "") => void;
  variant?: "dark" | "light";
  showUserSelect?: boolean;
}

export const ContractSelector: React.FC<ContractSelectorProps> = ({
  setSelectedContract,
  variant = "dark",
  showUserSelect = true,
}) => {
  const { t } = useTranslation();
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const localContracts = useAppSelector(
    (state) => state.localAnthology.userContracts[LOCAL_USER_ADDR]
  );
  const localTitles = useAppSelector(
    (state) => state.localAnthology.contractsTitles
  );

  const [selectedUser, setSelectedUser] = useState<Address>(
    LOCAL_USER_ADDR || ""
  );

  // WCAG 3.3.2 / 4.1.2 — label/control associations.
  const userSelectId = useId();
  const categorySelectId = useId();
  const subcategorySelectId = useId();
  const addressInputId = useId();

  const isLocalUser = selectedUser === LOCAL_USER_ADDR;

  const userContractsList = useMemo(() => {
    const currentContracts = isLocalUser
      ? localContracts
      : userContracts[selectedUser] || [];

    const contracts = currentContracts.map((address, index) => ({
      address,
      title: isLocalUser
        ? localTitles[address]
        : contractsTitles[address] || t("selector.untitled"),
      originalIndex: index,
    }));
    return parseContractsCategoriesSorted(contracts);
  }, [
    contractsTitles,
    localTitles,
    localContracts,
    isLocalUser,
    userContracts,
    selectedUser,
    t,
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    userContractsList.uncategorized.length > 0 ? "Other" : ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const categoryOptions = useMemo(() => {
    if (userContractsList.uncategorized.length > 0) {
      return ["Other", ...Object.keys(userContractsList.categories)];
    }

    return ["Select Category", ...Object.keys(userContractsList.categories)];
  }, [userContractsList.categories, userContractsList.uncategorized]);

  const subcategoryOptions = useMemo(() => {
    if (selectedCategory === "Other") return [];
    if (selectedCategory && userContractsList.categories[selectedCategory]) {
      return Object.keys(
        userContractsList.categories[selectedCategory].subcategories
      );
    }
    return [];
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
        width: "100%",
        padding: "10px",
        maxWidth: "350px",
        boxSizing: "border-box",
        backgroundColor:
          variant === "light" ? "#cbd5e1" : "rgba(255, 255, 255, 0.06)",
        borderRadius: "10px",
      }}
    >
      {showUserSelect && (
        <>
          <label htmlFor={userSelectId}>{t("selector.user")} </label>
          <select
            id={userSelectId}
            value={selectedUser}
            style={{
            minHeight: "30px",
            border: "1px solid #94a3b8",
            borderRadius: "6px",
            padding: "4px 8px",
          }}
            onChange={(e) => {
              setSelectedUser(e.target.value as Address);
              setSelectedCategory("");
              setSelectedSubcategory("");
              setSelectedAddress("");
              setSelectedContract("");
            }}
          >
            <option key={"localUser"} value={LOCAL_USER_ADDR}>
              {t("selector.localUser")}
            </option>
            {users.map((user) => (
              <option key={user} value={user}>
                {shortenAddress(user, 10, 10)}
              </option>
            ))}
          </select>
        </>
      )}

      <label htmlFor={categorySelectId}>{t("selector.category")} </label>
      <select
        id={categorySelectId}
        value={selectedCategory}
        onChange={handleCategoryChange}
        style={{
            minHeight: "30px",
            border: "1px solid #94a3b8",
            borderRadius: "6px",
            padding: "4px 8px",
          }}
      >
        {/* <option value="">No Category</option> */}
        {
          selectedUser === LOCAL_USER_ADDR &&
            categoryOptions.map((category) => (
              <option translate="no" key={category} value={category}>
                {category === "Other"
                  ? t("common.other")
                  : category === "Select Category"
                  ? t("selector.selectCategory")
                  : category}
              </option>
            ))
          //NOT LOCAL USER IS MISSING IN CATEGORIES
          /*           : categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )) */
        }
      </select>

      {/*       <div
        style={{ minHeight: "40px", display: "flex", flexDirection: "column" }}
      > */}
      {subcategoryOptions.length > 0 && (
        <>
          <label htmlFor={subcategorySelectId}>{t("selector.subcategory")} </label>

          <select
            id={subcategorySelectId}
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            style={{
              minHeight: "30px",
              marginTop: "10px",
              border: "1px solid #94a3b8",
              borderRadius: "6px",
              padding: "4px 8px",
            }}
          >
            <option value="">{t("selector.noSubcategory")}</option>
            {subcategoryOptions.map((subcategory) => (
              <option translate="no" key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </>
      )}
      {/*       </div> */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <br />
        {/*  <h3>Memoirs</h3> */}
        <ul
          style={{
            minHeight: "100px",
            //border: "1px solid #ccc",
            padding: "0px 10px 10px 10px",
          }}
        >
          {filteredContracts.map((contract) => (
            <li key={contract.address}>
              <button
                type="button"
                translate="no"
                onClick={() => {
                  setSelectedAddress(contract.address);
                  setSelectedContract(contract.address as Address);
                }}
                aria-pressed={selectedAddress === contract.address}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                  color:
                    selectedAddress === contract.address
                      ? variant === "light"
                        ? "#0891b2"
                        : "#22d3ee"
                      : variant === "light"
                      ? "#1a1a1a"
                      : "white",
                  fontWeight:
                    selectedAddress === contract.address ? 600 : 400,
                }}
              >
                {contract.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser !== LOCAL_USER_ADDR && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <label htmlFor={addressInputId}>{t("selector.anthologyAddress")} </label>
          <input
            id={addressInputId}
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
      )}
    </div>
  );
};
