import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Address, CurrentPaths } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
export interface UserState {
  userAddr: Address;
  walletId: string;
  currentPath: CurrentPaths;
}

const initialState: UserState = {
  userAddr: LOCAL_USER_ADDR,
  walletId: "",
  currentPath: `user/${LOCAL_USER_ADDR}`,
};

export const userSlice = createSlice({
  name: "factory",
  initialState,
  reducers: {
    updateUserAddr: (state, action: PayloadAction<Address>) => {
      state.userAddr = action.payload;
    },
    updateWalletId: (state, action: PayloadAction<Address>) => {
      state.walletId = action.payload;
    },
    updateCurrentPath: (state, action: PayloadAction<CurrentPaths>) => {
      state.currentPath = action.payload;
    },
    resetUserStore: () => {
      return initialState;
    },
  },
});

export const {
  updateUserAddr,
  updateWalletId,
  updateCurrentPath,
  resetUserStore,
} = userSlice.actions;

export default userSlice.reducer;
