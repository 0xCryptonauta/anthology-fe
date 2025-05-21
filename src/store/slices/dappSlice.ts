import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
//import { Address } from "@src/types/common";

export interface dappState {
  factoryRpc: string;
  isIconToLocal: boolean;
}

const initialState: dappState = {
  factoryRpc: "",
  isIconToLocal: true,
};

export const dappSlice = createSlice({
  name: "dapp",
  initialState,
  reducers: {
    updateFactoryRpc: (state, action: PayloadAction<string>) => {
      state.factoryRpc = action.payload;
    },
    toggleIsIconToLocal: (state) => {
      state.isIconToLocal = !state.isIconToLocal;
    },
    resetDappStore: () => {
      return initialState;
    },
  },
});

export const { updateFactoryRpc, toggleIsIconToLocal, resetDappStore } =
  dappSlice.actions;

export default dappSlice.reducer;
