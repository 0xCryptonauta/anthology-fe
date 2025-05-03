import { createAsyncThunk } from "@reduxjs/toolkit";
import { readFactory } from "@src/contract-functions/FactoryFunctions";
import { transformData } from "@src/utils/transformData";
import {
  updateContractTitles,
  updateUserContracts,
} from "../slices/factorySlice";

export const syncUserContractsToStore = createAsyncThunk(
  "userContracts/syncUserContractsToStore",
  async (user: string, { dispatch }) => {
    const userDB = await readFactory("getUsersContractsWithTitles", [[user]]);
    const { userContracts, titles } = transformData(
      userDB as string[][][],
      [user] as string[]
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
      userDB as string[][][],
      users as string[]
    );

    dispatch(updateContractTitles(titles));
    dispatch(updateUserContracts(userContracts));
  }
);
