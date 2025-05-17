import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@src/types/common";

interface userState {
  contracts: { [key: Address]: string[] };
}

interface localAnthologyState {
  users: { [key: Address]: userState };
}

const initialState: localAnthologyState = {
  users: {},
};

export const localAnthologySlice = createSlice({
  name: "localAnthology",
  initialState,
  reducers: {
    addMemoirToLocalAnthology: (
      state,
      action: PayloadAction<{
        userAddr: Address;
        contractAddr: Address;
        memoir: { title: string; content: string };
      }>
    ) => {
      const { userAddr, contractAddr, memoir } = action.payload;
      if (!state.users[userAddr]) {
        state.users[userAddr] = { contracts: {} };
      }
      if (!state.users[userAddr].contracts[contractAddr]) {
        state.users[userAddr].contracts[contractAddr] = [];
      }
      state.users[userAddr].contracts[contractAddr].push(
        JSON.stringify(memoir)
      );
    },
    deleteMemoirFromAnthology: (
      state,
      action: PayloadAction<{
        userAddr: Address;
        contractAddr: Address;
        memoirIndex: number;
      }>
    ) => {
      const { userAddr, contractAddr, memoirIndex } = action.payload;
      if (
        state.users[userAddr] &&
        state.users[userAddr].contracts[contractAddr]
      ) {
        state.users[userAddr].contracts[contractAddr].splice(memoirIndex, 1);
        if (state.users[userAddr].contracts[contractAddr].length === 0) {
          delete state.users[userAddr].contracts[contractAddr];
        }
        if (Object.keys(state.users[userAddr].contracts).length === 0) {
          delete state.users[userAddr];
        }
      }
    },
    resetUser: () => {
      return initialState;
    },
  },
});

export const {
  addMemoirToLocalAnthology,
  deleteMemoirFromAnthology,
  resetUser,
} = localAnthologySlice.actions;

export default localAnthologySlice.reducer;
