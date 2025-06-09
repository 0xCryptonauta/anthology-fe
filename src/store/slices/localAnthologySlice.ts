import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Address, SkinType } from "@src/types/common";
import { DEFAULT_SKIN, LOCAL_USER_ADDR } from "@src/utils/constants";
import { MemoirInterface } from "./anthologySlice";

interface localAnthologyState {
  users: Address[];
  userContracts: { [key: Address]: Address[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: Address]: string }; // Mapping of contract addresses to contract details (e.g., title)
  anthologies: { [key: Address]: MemoirInterface[] };
  defaultSkin: { [key: Address]: SkinType };
}

const initialState: localAnthologyState = {
  users: [LOCAL_USER_ADDR],
  userContracts: { [LOCAL_USER_ADDR]: ["0x11111111111111111111"] },
  contractsTitles: {
    ["0x11111111111111111111"]: "[Category][Subcat]Default Anthology Title",
  },
  anthologies: {
    ["0x11111111111111111111"]: [
      {
        sender: LOCAL_USER_ADDR,
        title: "Default Memoir Title",
        content: "This is a default memoir content.",
        timestamp: String(Math.floor(new Date().getTime() / 1000)),
      },
    ],
  },
  defaultSkin: { ["0x11111111111111111111"]: DEFAULT_SKIN },
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

    resetLocalAnthologyStore: () => {
      return initialState;
    },
  },
});

export const {
  addUserLocalAnthology,
  deleteUserLocalAnthology,
  addMemoirToUserLocalAnthology,
  deleteMemoirFromUserLocalAnthology,
  updateUserLocalAnthologyTitle,
  setDefaultSkin,
  resetLocalAnthologyStore,
} = localAnthologySlice.actions;

export default localAnthologySlice.reducer;
