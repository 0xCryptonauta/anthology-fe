import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FactoryBaseState {
  owner: string;
  isFrozen: boolean;
  whitelistEnabled: boolean;
  useErc20: boolean;
  erc20Token: string;
  anthologyPrice: number;
  userCount: number;
}

export interface FactoryState {
  owner: string;
  isFrozen: boolean;
  whitelistEnabled: boolean;
  useErc20: boolean;
  erc20Token: string;
  anthologyPrice: number;
  userCount: number;

  whitelistedUsers: string[];
  users: string[]; // Array of user addresses
  userContracts: { [key: string]: string[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: string]: string }; // Mapping of contract addresses to contract details (e.g., title)
}

const initialState: FactoryState = {
  owner: "",
  isFrozen: false,
  whitelistEnabled: false,
  useErc20: false,
  erc20Token: "",
  anthologyPrice: 0,
  userCount: 0,

  whitelistedUsers: [],
  users: [],
  userContracts: {},
  contractsTitles: {},
};

export const factorySlice = createSlice({
  name: "factory",
  initialState,
  reducers: {
    updateOwner: (state, action: PayloadAction<string>) => {
      state.owner = action.payload;
    },
    updateIsFrozen: (state, action: PayloadAction<boolean>) => {
      state.isFrozen = action.payload;
    },
    updateWhitelistEnabled: (state, action: PayloadAction<boolean>) => {
      state.whitelistEnabled = action.payload;
    },
    updateUseErc20: (state, action: PayloadAction<boolean>) => {
      state.useErc20 = action.payload;
    },
    updateErc20Token: (state, action: PayloadAction<string>) => {
      state.erc20Token = action.payload;
    },
    updateAnthologyPrice: (state, action: PayloadAction<number>) => {
      state.anthologyPrice = action.payload;
    },
    updateUserCount: (state, action: PayloadAction<number>) => {
      state.userCount = action.payload;
    },
    updateFactoryBasicInfo: (
      state,
      action: PayloadAction<FactoryBaseState>
    ) => {
      return { ...state, ...action.payload };
    },
    updateWhitelistedUsers: (state, action: PayloadAction<string[]>) => {
      state.whitelistedUsers = action.payload;
    },
    updateAddToWhitelist: (state, action: PayloadAction<string>) => {
      state.whitelistedUsers.push(action.payload);
    },
    updateRemoveFromWhitelist: (state, action: PayloadAction<string>) => {
      // Find the account index in the whiteliestedUsers array
      let index = 0;
      for (let i = 0; i < state.whitelistedUsers.length; i++) {
        if (state.whitelistedUsers[i] == action.payload) {
          index = i;
        }
      }
      // Swap account addr with last position in array and pop (delete) the last one
      const lastIndex = state.whitelistedUsers.length - 1;
      if (index != lastIndex) {
        state.whitelistedUsers[index] = state.whitelistedUsers[lastIndex];
      }

      state.whitelistedUsers.pop();
    },
    updateUsers: (state, action: PayloadAction<[]>) => {
      state.users = action.payload;
    },
    updateUserContracts: (
      state,
      action: PayloadAction<{ [key: string]: string[] }>
    ) => {
      state.userContracts = action.payload;
    },
    updateContractTitles: (
      state,
      action: PayloadAction<{ [key: string]: string }>
    ) => {
      state.contractsTitles = action.payload;
    },
    clearFactoryStore: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateOwner,
  updateIsFrozen,
  updateWhitelistEnabled,
  updateUseErc20,
  updateErc20Token,
  updateAnthologyPrice,
  updateUserCount,
  updateFactoryBasicInfo,
  updateWhitelistedUsers,
  updateAddToWhitelist,
  updateRemoveFromWhitelist,
  updateUsers,
  updateUserContracts,
  updateContractTitles,
  clearFactoryStore,
} = factorySlice.actions;

export default factorySlice.reducer;

/* mapping(address => address[]) public userContracts;
address[] public users;
address[] public whitelistedUsers;
 */
