import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Address, SkinType } from "@src/types/common";

export interface MemoirInterface {
  sender: Address;
  title: string;
  content: string;
  timestamp: string;
}

export interface AnthologyInfoInterface {
  owner: Address;
  title: string;
  skin: SkinType;
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
  [key: Address]: AnthologyInterface;
}

const initialState: Anthologies = {};

export const anthologySlice = createSlice({
  name: "anthology",
  initialState,
  reducers: {
    addAnthology: (
      state,
      action: PayloadAction<{
        contract: Address;
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
    //NOT BEING USED,
    updateAnthologyState: (
      state,
      action: PayloadAction<{
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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
        contract: Address;
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

    // ---------------------- New functions for owner panel ----------------------

    updateAnthologyTitle: (
      state,
      action: PayloadAction<{
        contract: Address;
        title: string;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _title = action.payload.title;
      state[_contract].anthologyState.title = _title;
    },

    updateUseBuffer: (
      state,
      action: PayloadAction<{
        contract: Address;
        useBuffer: boolean;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _useBuffer = action.payload.useBuffer;
      state[_contract].anthologyState.useBuffer = _useBuffer;
    },

    updateUseErc20: (
      state,
      action: PayloadAction<{
        contract: Address;
        useERC20: boolean;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _useERC20 = action.payload.useERC20;
      state[_contract].anthologyState.useERC20 = _useERC20;
    },

    updateWhitelistEnabled: (
      state,
      action: PayloadAction<{
        contract: Address;
        whitelistEnabled: boolean;
      }>
    ) => {
      const _contract = action.payload.contract;
      const _whitelistEnabled = action.payload.whitelistEnabled;
      state[_contract].anthologyState.whitelistEnabled = _whitelistEnabled;
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
  //New functions
  updateAnthologyTitle,
  updateUseBuffer,
  updateUseErc20,
  updateWhitelistEnabled,
} = anthologySlice.actions;

export default anthologySlice.reducer;
