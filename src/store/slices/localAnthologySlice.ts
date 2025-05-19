import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { MemoirInterface } from "./anthologySlice";

interface localAnthologyState {
  users: Address[];
  userContracts: { [key: Address]: Address[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: Address]: string }; // Mapping of contract addresses to contract details (e.g., title)
  anthologies: { [key: Address]: MemoirInterface[] };
}

const initialState: localAnthologyState = {
  users: [LOCAL_USER_ADDR],
  userContracts: { [LOCAL_USER_ADDR]: ["0x11111111111111111111"] },
  contractsTitles: {
    ["0x11111111111111111111"]: "[Category][Subcat]Default Title",
  },
  anthologies: {
    ["0x11111111111111111111"]: [
      {
        sender: LOCAL_USER_ADDR,
        title: "Default Memoir",
        content: "This is a default memoir.",
        timestamp: String(Math.floor(new Date().getTime() / 1000)),
      },
    ],
  },
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
      if (!state.users.includes(user)) {
        state.users.push(user);
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

    resetUser: () => {
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
  resetUser,
} = localAnthologySlice.actions;

export default localAnthologySlice.reducer;
