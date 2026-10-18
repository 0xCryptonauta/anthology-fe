import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
//import { Address } from "@src/types/common";

export type LocalePreference = "auto" | "en" | "es";
export type ResolvedLocale = "en" | "es";

export interface dappState {
  factoryRpc: string;
  isIconToLocal: boolean;
  categoryBackgroundsEnabled: boolean;
  anthologyFooterBgClass: string;
  locale: LocalePreference;
}

const initialState: dappState = {
  factoryRpc: "",
  isIconToLocal: true,
  categoryBackgroundsEnabled: true,
  anthologyFooterBgClass: "",
  locale: "auto",
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
    setLocale: (state, action: PayloadAction<LocalePreference>) => {
      state.locale = action.payload;
    },
    resetDappStore: () => {
      return initialState;
    },
    setAnthologyFooterBgClass: (state, action: PayloadAction<string>) => {
      state.anthologyFooterBgClass = action.payload;
    },
  },
});

export const { updateFactoryRpc, toggleIsIconToLocal, toggleCategoryBackgrounds, setLocale, resetDappStore, setAnthologyFooterBgClass } =
  dappSlice.actions;

export default dappSlice.reducer;
