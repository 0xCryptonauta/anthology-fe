import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  userAddr: string;
}

const initialState: UserState = {
  userAddr: "",
};

export const userSlice = createSlice({
  name: "factory",
  initialState,
  reducers: {
    updateUserAddr: (state, action: PayloadAction<string>) => {
      state.userAddr = action.payload;
    },
  },
});

export const { updateUserAddr } = userSlice.actions;

export default userSlice.reducer;
