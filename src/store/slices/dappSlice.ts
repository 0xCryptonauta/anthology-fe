import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
//import { Address } from "@src/types/common";

export interface dappState {
  factoryRpc: string;
  isIconToLocal: boolean;
  categoryBackgroundsEnabled: boolean;
}

const initialState: dappState = {
  factoryRpc: "",
  isIconToLocal: true,
  categoryBackgroundsEnabled: true,
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
    toggleCategoryBackgrounds: (state) => {
      state.categoryBackgroundsEnabled = !state.categoryBackgroundsEnabled;
    },
    resetDappStore: () => {
      return initialState;
    },
  },
});

export const { updateFactoryRpc, toggleIsIconToLocal, toggleCategoryBackgrounds, resetDappStore } =
  dappSlice.actions;

export default dappSlice.reducer;
