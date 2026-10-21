import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SocialEmbedProvider } from "@src/utils/socialEmbedProviders";
//import { Address } from "@src/types/common";

export type LocalePreference = "auto" | "en" | "es";
export type ResolvedLocale = "en" | "es";

export interface dappState {
  factoryRpc: string;
  isIconToLocal: boolean;
  categoryBackgroundsEnabled: boolean;
  anthologyFooterBgClass: string;
  locale: LocalePreference;
  /** Providers whose embeds the user explicitly allowed to load. */
  allowedSocialEmbeds: SocialEmbedProvider[];
}

const initialState: dappState = {
  factoryRpc: "",
  isIconToLocal: true,
  categoryBackgroundsEnabled: true,
  anthologyFooterBgClass: "",
  locale: "auto",
  allowedSocialEmbeds: [],
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
    setSocialEmbedAllowed: (
      state,
      action: PayloadAction<{
        provider: SocialEmbedProvider;
        allowed: boolean;
      }>
    ) => {
      // Older persisted stores may not have the field yet.
      const allowed = state.allowedSocialEmbeds ?? [];

      state.allowedSocialEmbeds = action.payload.allowed
        ? allowed.includes(action.payload.provider)
          ? allowed
          : [...allowed, action.payload.provider]
        : allowed.filter((provider) => provider !== action.payload.provider);
    },
    resetSocialEmbedConsent: (state) => {
      state.allowedSocialEmbeds = [];
    },
  },
});

export const {
  updateFactoryRpc,
  toggleIsIconToLocal,
  toggleCategoryBackgrounds,
  setLocale,
  resetDappStore,
  setAnthologyFooterBgClass,
  setSocialEmbedAllowed,
  resetSocialEmbedConsent,
} = dappSlice.actions;

export default dappSlice.reducer;
