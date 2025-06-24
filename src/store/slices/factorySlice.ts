import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@src/types/common";

export interface FactoryBaseState {
  owner: string;
  isFrozen: boolean;
  whitelistEnabled: boolean;
  useErc20: boolean;
  erc20Token: string;
  anthologyPrice: number;
  userCount: number;
  usersCP: number;
}

export interface FactoryState {
  owner: string;
  isFrozen: boolean;
  whitelistEnabled: boolean;
  useErc20: boolean;
  erc20Token: string;
  anthologyPrice: number;
  userCount: number;
  usersCP: number;

  whitelistedUsers: Address[];
  users: Address[]; // Array of user addresses
  userContracts: { [key: Address]: Address[] }; // Mapping of user addresses to arrays of contract addresses
  contractsTitles: { [key: Address]: string }; // Mapping of contract addresses to contract details (e.g., title)
}

const initialState: FactoryState = {
  owner: "",
  isFrozen: false,
  whitelistEnabled: false,
  useErc20: false,
  erc20Token: "",
  anthologyPrice: 0,
  userCount: 0,
  usersCP: 0,

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
    updateUsersCP: (state, action: PayloadAction<number>) => {
      state.usersCP = action.payload;
    },
    updateFactoryBasicInfo: (
      state,
      action: PayloadAction<FactoryBaseState>
    ) => {
      return { ...state, ...action.payload };
    },
    updateWhitelistedUsers: (state, action: PayloadAction<Address[]>) => {
      state.whitelistedUsers = action.payload;
    },
    updateAddToWhitelist: (state, action: PayloadAction<Address>) => {
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
    updateUsers: (state, action: PayloadAction<Address[]>) => {
      const data = action.payload;
      data.forEach((address) => {
        if (!state.users.includes(address)) {
          state.users.push(address);
        }
      });
    },

    updateUserContracts: (
      state,
      action: PayloadAction<{ [key: Address]: Address[] }>
    ) => {
      state.userContracts = Object.keys(action.payload).reduce(
        (acc, key) => {
          const addressKey = key as Address;
          const newContracts = action.payload[addressKey];

          if (acc[addressKey]) {
            acc[addressKey] = [
              ...new Set([...acc[addressKey], ...newContracts]),
            ];
          } else {
            acc[addressKey] = [...new Set(newContracts)];
          }

          return acc;
        },
        { ...state.userContracts } as { [key: Address]: Address[] }
      );
    },

    updateContractTitles: (
      state,
      action: PayloadAction<{ [key: string]: string }>
    ) => {
      state.contractsTitles = { ...state.contractsTitles, ...action.payload };
    },
    updateOneContractTitle: (
      state,
      action: PayloadAction<{ contract: Address; title: string }>
    ) => {
      state.contractsTitles[action.payload.contract] = action.payload.title;
    },
    resetFactoryStore: () => {
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
  resetFactoryStore,
  updateUsersCP,
  updateOneContractTitle,
} = factorySlice.actions;

export default factorySlice.reducer;

/* mapping(address => address[]) public userContracts;
address[] public users;
address[] public whitelistedUsers;
 */
