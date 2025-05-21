import { createAsyncThunk } from "@reduxjs/toolkit";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { Address } from "@src/types/common";
import { transformData } from "@src/utils/transformData";
import {
  updateContractTitles,
  updateUserContracts,
} from "@store/slices/factorySlice";

export const syncUserContractsToStore = createAsyncThunk(
  "userContracts/syncUserContractsToStore",
  async (user: Address, { dispatch }) => {
    const userDB = await readFactory("getUsersContractsWithTitles", [[user]]);
    const { userContracts, titles } = transformData(
      userDB as Address[][][],
      [user] as Address[]
    );
    console.log("userDB", userDB);
    dispatch(updateContractTitles(titles));
    dispatch(updateUserContracts(userContracts));
  }
);

export const syncUsersContractsToStore = createAsyncThunk(
  "usersContracts/syncUserContractsToStore",
  async (users: string[], { dispatch }) => {
    const userDB = await readFactory("getUsersContractsWithTitles", [users]);
    console.log("userDB", userDB);
    const { userContracts, titles } = transformData(
      userDB as Address[][][],
      users as Address[]
    );

    dispatch(updateContractTitles(titles));
    dispatch(updateUserContracts(userContracts));
  }
);
