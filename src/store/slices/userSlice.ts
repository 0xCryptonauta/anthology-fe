import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INTERNAL_USER_ADDR } from "@src/utils/constants";

type Address = `0x${string}`;
export interface UserState {
  userAddr: Address;
  walletId: string;
}

const initialState: UserState = {
  userAddr: INTERNAL_USER_ADDR,
  walletId: "",
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
    resetUser: () => {
      return initialState;
    },
  },
});

export const { updateUserAddr, updateWalletId, resetUser } = userSlice.actions;

export default userSlice.reducer;
