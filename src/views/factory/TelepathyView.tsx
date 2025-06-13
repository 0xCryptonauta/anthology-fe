import { useAppDispatch } from "@store/utils/hooks";
import { useToast } from "@components/Layout/Toast";

import { useState } from "react";

import { FactoryUsersContracts } from "@src/components/Factory/FactoryUsersContracts";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import {
  updateOneContractTitle,
  updateUserContracts,
  updateUsers,
} from "@src/store/slices/factorySlice";
import { readAnthology } from "@src/contract-functions/anthologyFunctions";
import {
  addAnthology,
  AnthologyInfoInterface,
} from "@src/store/slices/anthologySlice";

const searchOptions = ["User Address", "Anthology Address"];

export const TelepathyView = () => {
  const dispatch = useAppDispatch();

  const { users, contractsTitles } = useAppSelector((state) => state.factory);

  const { addToast } = useToast();

  const [addressToAdd, setAddressToAdd] = useState("");
  const [selectedSearchOption, setSelectedSearchOption] = useState(
    searchOptions[0]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <span>Telepathy</span>
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            width="250px"
            type="text"
            placeholder="User addr - ENS - Anthology addr"
            value={addressToAdd}
            onChange={(event) => {
              setAddressToAdd(event.target.value);
            }}
            autoComplete="new-password"
          ></input>
        </div>
      </div>
      <div>
        <select
          value={selectedSearchOption}
          onChange={(event) => {
            setSelectedSearchOption(event.target.value);
          }}
          style={{
            backgroundColor: "#f9f9f9",
            color: "#111",
            padding: "6px",
            borderRadius: "8px",
            border: "1px solid #e2e2e2",
            fontSize: "16px",
            fontWeight: 500,
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
        >
          {searchOptions.map((option) => (
            <option
              key={option}
              value={option}
              style={{ backgroundColor: "#fff" }}
            >
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          onClick={async () => {
            if (addressToAdd === "") {
              addToast({
                title: "Enter address",
                content: "Please enter an address to mind read",
                variant: "info",
                delay: 3000,
              });
              return;
            }
            if (selectedSearchOption === "User Address") {
              console.log("Adding user address:", addressToAdd);
              if (!users.includes(addressToAdd as Address)) {
                const contracts = (await readFactory("userContracts", [
                  addressToAdd,
                  0,
                ])) as Address[];
                console.log("Contracts  for user:", contracts);
                if (contracts.length > 0) {
                  dispatch(updateUsers([addressToAdd as Address]));
                  // should the below fetches be in this component?
                  // dispatch(updateUserContracts({ [addressToAdd]: contractsAndTitles.contracts }));
                  // dispatch(updateContractTitles(contractsAndTitles.titles));
                  addToast({
                    title: "User found",
                    content: `User ${addressToAdd} has been added successfully.`,
                    variant: "success",
                    delay: 3000,
                  });
                } else {
                  addToast({
                    title: "User not found",
                    content: `No user found with address ${addressToAdd}.`,
                    variant: "warning",
                    delay: 3000,
                  });
                }
              }
            } else if (selectedSearchOption === "Anthology Address") {
              // fetch data from factory
              // check if anthology is from factory
              // if exists, add anthology to owner in tree.
              // fetch all memoirs
              // dispatch(addAnthology(addressToAdd));
              console.log("Adding anthology address:", addressToAdd);
              if (!contractsTitles[addressToAdd as Address]) {
                const anthologyInfo = (await readAnthology(
                  addressToAdd as Address,
                  "getAnthologyInfo"
                )) as AnthologyInfoInterface;

                if (anthologyInfo) {
                  dispatch(updateUsers([anthologyInfo.owner]));
                  dispatch(
                    updateUserContracts({
                      [anthologyInfo.owner]: [addressToAdd as Address],
                    })
                  );
                  dispatch(
                    updateOneContractTitle({
                      contract: addressToAdd as Address,
                      title: anthologyInfo.title,
                    })
                  );
                  dispatch(
                    addAnthology({
                      contract: anthologyInfo.owner,
                      anthologyInfo: {
                        ...anthologyInfo,
                        totalCreatedMemoirs: Number(
                          anthologyInfo.totalCreatedMemoirs
                        ),
                        currentMemoirCount: Number(
                          anthologyInfo.currentMemoirCount
                        ),
                        maxMemoirs: Number(anthologyInfo.maxMemoirs),
                        memoirPrice: Number(anthologyInfo.memoirPrice),
                        memoirsCP: Number(anthologyInfo.memoirsCP),
                        memoirBufferCP: Number(anthologyInfo.memoirBufferCP),
                        whitelistCP: Number(anthologyInfo.whitelistCP),
                      },
                    })
                  );
                  addToast({
                    title: "Anthology found",
                    content: `Anthology ${addressToAdd} has been added successfully.`,
                    variant: "success",
                    delay: 3000,
                  });
                } else {
                  addToast({
                    title: "Anthology not found",
                    content: `No anthology found with address ${addressToAdd}.`,
                    variant: "info",
                    delay: 3000,
                  });
                }
              }
            }
          }}
        >
          Add
        </button>
      </div>
      {/* USE FactoryUsersContracts, rename to TelepathyDirectory */}
      <div style={{ marginTop: "30px" }}>
        <FactoryUsersContracts />
      </div>
    </div>
  );
};
