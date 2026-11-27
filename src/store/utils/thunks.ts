import { createAsyncThunk } from "@reduxjs/toolkit";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { Address } from "@src/types/common";
import { transformFactoryContracts } from "@src/utils/transformData";
import {
  updateContractTitles,
  updateUserContracts,
} from "@store/slices/factorySlice";

export const syncUserContractsToStore = createAsyncThunk(
  "userContracts/syncUserContractsToStore",
  async (user: Address, { dispatch }) => {
    const userDB = await readFactory("getUsersContractsWithTitles", [[user]]);
    if (userDB === undefined) {
      throw new Error("Factory contracts request failed");
    }

    const { userContracts, titles } = transformFactoryContracts(userDB, [user]);
    dispatch(updateContractTitles(titles));
    dispatch(updateUserContracts(userContracts));
    return { userContracts, titles };
  }
);

export const syncUsersContractsToStore = createAsyncThunk(
  "usersContracts/syncUserContractsToStore",
  async (users: Address[], { dispatch }) => {
    const userDB = await readFactory("getUsersContractsWithTitles", [users]);
    if (userDB === undefined) {
      throw new Error("Factory contracts request failed");
    }

    const { userContracts, titles } = transformFactoryContracts(userDB, users);
    dispatch(updateContractTitles(titles));
    dispatch(updateUserContracts(userContracts));
    return { userContracts, titles };
  }
);
