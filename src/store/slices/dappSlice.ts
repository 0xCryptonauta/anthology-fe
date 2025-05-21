import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
//import { Address } from "@src/types/common";

export interface dappState {
  factoryRpc: string;
  shouldAddToBlockchain: boolean;
}

const initialState: dappState = {
  factoryRpc: "",
  shouldAddToBlockchain: false,
};

export const dappSlice = createSlice({
  name: "dapp",
  initialState,
  reducers: {
    updateFactoryRpc: (state, action: PayloadAction<string>) => {
      state.factoryRpc = action.payload;
    },
    toggleShouldAddToBlockchain: (state) => {
      state.shouldAddToBlockchain = !state.shouldAddToBlockchain;
    },
    resetUser: () => {
      return initialState;
    },
  },
});

export const { updateFactoryRpc, toggleShouldAddToBlockchain, resetUser } =
  dappSlice.actions;

export default dappSlice.reducer;
