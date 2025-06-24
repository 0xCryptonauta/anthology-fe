import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  Address,
  AnthologyType,
  ContractTitlesType,
  SkinType,
  UserContractsType,
} from "@src/types/common";
import { DEFAULT_SKIN, LOCAL_USER_ADDR } from "@src/utils/constants";
import { MemoirInterface } from "./anthologySlice";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";

export interface localAnthologyState {
  users: Address[];
  userContracts: UserContractsType; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: ContractTitlesType; // Mapping of contract addresses to contract details (e.g., title)
  anthologies: AnthologyType;
  defaultSkin: { [key: Address]: SkinType };
}

const newLocalAddr = generateLocalContractAddr();

const initialState: localAnthologyState = {
  users: [LOCAL_USER_ADDR],
  userContracts: { [LOCAL_USER_ADDR]: [newLocalAddr] },
  contractsTitles: {
    [newLocalAddr]: "[Category][Subcat]Default Title",
  },
  anthologies: {
    [newLocalAddr]: [
      {
        sender: LOCAL_USER_ADDR,
        title: "Default Memoir Title",
        content: "This is a default memoir content.",
        timestamp: String(Math.floor(new Date().getTime() / 1000)),
      },
    ],
  },
  defaultSkin: { [newLocalAddr]: DEFAULT_SKIN },
};

export const localAnthologySlice = createSlice({
  name: "localAnthology",
  initialState,
  reducers: {
    addUserLocalAnthology(
      state,
      action: PayloadAction<{
        user: Address;
        contract: Address;
        title: string;
      }>
    ) {
      const { user, contract, title } = action.payload;

      // Initialize top-level objects if needed
      if (!state.users) {
        state.users = [];
      }
      if (!state.userContracts) {
        state.userContracts = {};
      }
      if (!state.contractsTitles) {
        state.contractsTitles = {};
      }
      if (!state.anthologies) {
        state.anthologies = {};
      }

      if (!state.users.includes(user)) {
        state.users.push(user);
        state.userContracts[user] = [];
      }

      if (!Array.isArray(state.userContracts[user])) {
        state.userContracts[user] = [];
      }

      if (!state.userContracts[user].includes(contract)) {
        state.userContracts[user].push(contract);
        state.contractsTitles[contract] = title;
        state.anthologies[contract] = state.anthologies[contract] || [];
        state.defaultSkin[contract] = "media";
      }
    },
    addMemoirToUserLocalAnthology(
      state,
      action: PayloadAction<{
        contract: Address;
        memoir: MemoirInterface;
      }>
    ) {
      const { contract, memoir } = action.payload;
      if (!state.anthologies[contract]) {
        state.anthologies[contract] = [];
      }
      state.anthologies[contract].push(memoir);
    },
    addManyMemoirsToUserLocalAnthology(
      state,
      action: PayloadAction<{
        contract: Address;
        memoirs: MemoirInterface[];
      }>
    ) {
      const { contract, memoirs } = action.payload;

      if (!state.anthologies[contract]) {
        state.anthologies[contract] = [];
      }

      state.anthologies[contract].push(...memoirs);
    },
    addAnthologiesToLocalMemory(
      state,
      action: PayloadAction<{
        anthologies: { [key: Address]: MemoirInterface[] };
      }>
    ) {
      const { anthologies } = action.payload;

      for (const contract in anthologies) {
        if (!state.anthologies[contract as Address]) {
          state.anthologies[contract as Address] = [];
        }

        state.anthologies[contract as Address].push(
          ...anthologies[contract as Address]
        );
      }
    },

    deleteMemoirFromUserLocalAnthology(
      state,
      action: PayloadAction<{
        contract: Address;
        memoir: MemoirInterface;
      }>
    ) {
      const { contract, memoir } = action.payload;
      if (state.anthologies[contract]) {
        state.anthologies[contract] = state.anthologies[contract].filter(
          (m) =>
            m.sender !== memoir.sender ||
            m.title !== memoir.title ||
            m.content !== memoir.content ||
            m.timestamp !== memoir.timestamp
        );
      }
    },
    deleteUserLocalAnthology(
      state,
      action: PayloadAction<{ user: Address; contract: Address }>
    ) {
      const { user, contract } = action.payload;
      if (
        state.userContracts[user] &&
        state.userContracts[user].includes(contract)
      ) {
        state.userContracts[user] = state.userContracts[user].filter(
          (c) => c !== contract
        );
        if (state.userContracts[user].length === 0) {
          delete state.userContracts[user];
          delete state.contractsTitles[contract];
          state.users = state.users.filter((u) => u !== user);
        }
      }
    },
    updateUserLocalAnthologyTitle(
      state,
      action: PayloadAction<{
        contract: Address;
        newTitle: string;
      }>
    ) {
      const { contract, newTitle } = action.payload;
      if (newTitle) {
        state.contractsTitles[contract] = newTitle;
      }
    },
    updateLocalUserContracts: (
      state,
      action: PayloadAction<{ [key: Address]: Address[] }>
    ) => {
      state.userContracts = Object.keys(action.payload).reduce(
        (acc, key) => {
          const addressKey = key as Address;
          const newContracts = action.payload[addressKey];

          if (acc[addressKey]) {
            acc[addressKey] = [
              ...new Set([...acc[addressKey], ...newContracts]),
            ];
          } else {
            acc[addressKey] = [...new Set(newContracts)];
          }

          return acc;
        },
        { ...state.userContracts } as { [key: Address]: Address[] }
      );
    },

    updateLocalContractTitles: (
      state,
      action: PayloadAction<{ [key: string]: string }>
    ) => {
      state.contractsTitles = { ...state.contractsTitles, ...action.payload };
    },
    setDefaultSkin: (
      state,
      action: PayloadAction<{
        contract: Address;
        newDefaultSkin: SkinType;
      }>
    ) => {
      const { contract, newDefaultSkin } = action.payload;

      if (!state.defaultSkin) {
        state.defaultSkin = {};
      }

      state.defaultSkin[contract] = newDefaultSkin;
    },
    setManyDefaultSkin: (
      state,
      action: PayloadAction<{ [key: Address]: SkinType }>
    ) => {
      const newDefaultSkins = action.payload;

      for (const address in newDefaultSkins) {
        const typedAddress = address as Address;
        state.defaultSkin[typedAddress] = newDefaultSkins[typedAddress];
      }
    },
    resetLocalAnthologyStore: () => {
      return initialState;
    },
  },
});

export const {
  addUserLocalAnthology,
  deleteUserLocalAnthology,
  addMemoirToUserLocalAnthology,
  addManyMemoirsToUserLocalAnthology,
  addAnthologiesToLocalMemory,
  deleteMemoirFromUserLocalAnthology,
  updateUserLocalAnthologyTitle,
  setDefaultSkin,
  updateLocalUserContracts,
  updateLocalContractTitles,
  setManyDefaultSkin,
  resetLocalAnthologyStore,
} = localAnthologySlice.actions;

export default localAnthologySlice.reducer;
