import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Address = string;

export interface MemoirInterface {
  sender: Address;
  title: string;
  content: string;
  timestamp: string;
}

export interface AnthologyInfoInterface {
  owner: string;
  title: string;
  skin: string;
  totalCreatedMemoirs: number;
  currentMemoirCount: number;
  maxMemoirs: number;
  memoirPrice: number;
  whitelistEnabled: boolean;
  //isFrozen: boolean;      // add
  useBuffer: boolean;
  useERC20: boolean;
  erc20Token: Address;
  anthologyHash: string;
  memoirsCP: number;
  memoirBufferCP: number;
  whitelistCP: number;
}

export interface AnthologyInterface {
  anthologyState: AnthologyInfoInterface;
  memoirs: MemoirInterface[];
  memoirBuffer: MemoirInterface[];
  whitelist: Address[];
}

export interface Anthologies {
  [key: string]: AnthologyInterface;
}

const initialState: Anthologies = {};

export const anthologySlice = createSlice({
  name: "anthology",
  initialState,
  reducers: {
    addAnthology: (
      state,
      action: PayloadAction<{
        contract: string;
        anthologyInfo: AnthologyInfoInterface;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _anthologyInfo = action.payload.anthologyInfo;
      state[_contract] = {
        anthologyState: _anthologyInfo,
        memoirs: [],
        memoirBuffer: [],
        whitelist: [],
      };
    },

    updateAnthologyState: (
      state,
      action: PayloadAction<{
        contract: string;
        anthologyInfo: AnthologyInfoInterface;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _anthologyInfo = action.payload.anthologyInfo;
      state[_contract].anthologyState = _anthologyInfo;
    },

    updateAnthologyCP: (
      state,
      action: PayloadAction<{
        contract: string;
        memoirsCP: number;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _newCP = action.payload.memoirsCP;
      state[_contract].anthologyState.memoirsCP = _newCP;
    },

    updateAnthologyWhitelistCP: (
      state,
      action: PayloadAction<{
        contract: string;
        whitelistCP: number;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _newCP = action.payload.whitelistCP;
      state[_contract].anthologyState.whitelistCP = _newCP;
    },

    updateAnthologyBufferCP: (
      state,
      action: PayloadAction<{
        contract: string;
        memoirBufferCP: number;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _newCP = action.payload.memoirBufferCP;
      state[_contract].anthologyState.whitelistCP = _newCP;
    },

    updateMemoirs: (
      state,
      action: PayloadAction<{
        contract: string;
        memoirs: MemoirInterface[];
      }>
    ) => {
      const _contract = action.payload.contract;
      const _memoirs = action.payload.memoirs;
      state[_contract].memoirs = _memoirs;
    },

    removeOneFromMemoirs: (
      state,
      action: PayloadAction<{
        contract: string;
        memoirIndex: number;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _memoirIndex = action.payload.memoirIndex;
      const _memoirLenght = state[_contract].memoirs.length;
      if (_memoirIndex != _memoirLenght - 1) {
        state[_contract].memoirs[_memoirIndex] =
          state[_contract].memoirs[_memoirLenght - 1];
      }
      state[_contract].memoirs.pop();
    },

    updateMemoirBuffer: (
      state,
      action: PayloadAction<{
        contract: string;
        memoirBuffer: MemoirInterface[];
      }>
    ) => {
      const _contract = action.payload.contract;
      const _memoirBuffer = action.payload.memoirBuffer;
      state[_contract].memoirBuffer = _memoirBuffer;
    },

    removeOneFromBuffer: (
      state,
      action: PayloadAction<{
        contract: string;
        memoirIndex: number;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _memoirIndex = action.payload.memoirIndex;
      const _memoirLenght = state[_contract].memoirBuffer.length;
      if (_memoirIndex != _memoirLenght - 1) {
        state[_contract].memoirBuffer[_memoirIndex] =
          state[_contract].memoirBuffer[_memoirLenght - 1];
      }
      state[_contract].memoirBuffer.pop();
    },

    updateWhitelist: (
      state,
      action: PayloadAction<{
        contract: string;
        whitelistedUsers: Address[];
      }>
    ) => {
      const _contract = action.payload.contract;
      const _whitelistedUsers = action.payload.whitelistedUsers;
      state[_contract].whitelist = _whitelistedUsers;
    },

    clearAnthologyStore: () => {
      return initialState;
    },
  },
});

export const {
  addAnthology,
  updateAnthologyState,
  updateAnthologyCP,
  updateAnthologyWhitelistCP,
  updateAnthologyBufferCP,
  updateMemoirs,
  updateMemoirBuffer,
  updateWhitelist,
  removeOneFromBuffer,
  removeOneFromMemoirs,
  clearAnthologyStore,
} = anthologySlice.actions;

export default anthologySlice.reducer;
