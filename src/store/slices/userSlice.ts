import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userAddr: string;
  walletId: string;
}

const initialState: UserState = {
  userAddr: "",
  walletId: "",
};

export const userSlice = createSlice({
  name: "factory",
  initialState,
  reducers: {
    updateUserAddr: (state, action: PayloadAction<string>) => {
      state.userAddr = action.payload;
    },
    updateWalletId: (state, action: PayloadAction<string>) => {
      state.walletId = action.payload;
    },
  },
});

export const { updateUserAddr, updateWalletId } = userSlice.actions;

export default userSlice.reducer;
