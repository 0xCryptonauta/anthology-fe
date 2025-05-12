import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
//import { Address } from "@src/types/common";

export interface dappState {
  factoryRpc: string;
}

const initialState: dappState = {
  factoryRpc: "",
};

export const dappSlice = createSlice({
  name: "dapp",
  initialState,
  reducers: {
    updateFactoryRpc: (state, action: PayloadAction<string>) => {
      state.factoryRpc = action.payload;
    },
    resetUser: () => {
      return initialState;
    },
  },
});

export const { updateFactoryRpc, resetUser } = dappSlice.actions;

export default dappSlice.reducer;
