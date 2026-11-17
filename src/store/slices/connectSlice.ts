import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocalId } from "@src/types/connect";
import { generateLocalId } from "@src/utils/localId";

export interface ConnectState {
  deviceId: LocalId | null;
  nametag: string;
}

const initialState: ConnectState = { deviceId: null, nametag: "" };

export const connectSlice = createSlice({
  name: "connect",
  initialState,
  reducers: {
    ensureDeviceId: {
      reducer(state, action: PayloadAction<LocalId>) {
        if (!state.deviceId) state.deviceId = action.payload;
      },
      prepare() {
        return { payload: generateLocalId() };
      },
    },
    setNametag(state, action: PayloadAction<string>) {
      state.nametag = action.payload.trim().slice(0, 32);
    },
    resetConnectStore() {
      return { deviceId: null, nametag: "" };
    },
  },
});

export const { ensureDeviceId, setNametag, resetConnectStore } =
  connectSlice.actions;
export default connectSlice.reducer;
