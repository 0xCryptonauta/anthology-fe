import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  updateFactoryBasicInfo,
  updateUsers,
  updateUsersCP,
  updateWhitelistedUsers,
} from "@store/slices/factorySlice";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { fetchFactoryInfo } from "@src/contract-functions/fetchContractInfo";
import { useAppSelector } from "@src/store/utils/hooks";

export const useGetFactoryInfo = () => {
  const dispatch = useDispatch();
  const { usersCP } = useAppSelector((state) => state.factory);
  useEffect(() => {
    const setupFactory = async () => {
      let CP = 0;

      if (usersCP) {
        CP = Number(await readFactory("usersCP"));
        dispatch(updateUsersCP(CP));
      } else {
        // Fetch basic factory info
        const contractInfo = await fetchFactoryInfo();
        dispatch(updateFactoryBasicInfo(contractInfo));
        CP = contractInfo.usersCP;

        // If whitelist is enabled, fetch whitelisted addresses
        if (contractInfo.whitelistEnabled) {
          const whitelistedUsers = await readFactory("getWhitelistedUsers");
          dispatch(updateWhitelistedUsers(whitelistedUsers as string[]));
        }
      }

      if (CP !== usersCP) {
        // Fetch all registered users
        const users = await readFactory("getUsers", [usersCP, CP]);
        console.log("USERS:", users);
        dispatch(updateUsers(users as []));
      }
    };

    setupFactory();
  }, [dispatch, usersCP]);
};
