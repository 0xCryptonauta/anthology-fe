import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateFactoryBasicInfo,
  updateWhitelistedUsers,
} from "@store/slices/factorySlice";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { fetchFactoryInfo } from "@src/contract-functions/fetchContractInfo";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";

export const useGetFactoryInfo = () => {
  const dispatch = useDispatch();
  const { usersCP, owner } = useAppSelector((state) => state.factory);
  useEffect(() => {
    const setupFactory = async () => {
      // Fetch basic factory info
      const contractInfo = await fetchFactoryInfo();
      dispatch(updateFactoryBasicInfo(contractInfo));

      // If whitelist is enabled, fetch whitelisted addresses
      // owner as temp, need to timestamp CPs
      if (contractInfo.whitelistEnabled && !owner) {
        const whitelistedUsers = await readFactory("getWhitelistedUsers");
        dispatch(updateWhitelistedUsers(whitelistedUsers as Address[]));
      }
    };

    setupFactory();
  }, [dispatch, usersCP, owner]);
};
