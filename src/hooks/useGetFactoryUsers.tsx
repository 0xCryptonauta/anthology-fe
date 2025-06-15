import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { updateUsers, updateUsersCP } from "@store/slices/factorySlice";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";

export const useGetFactoryUsers = () => {
  const dispatch = useDispatch();
  const { usersCP } = useAppSelector((state) => state.factory);
  useEffect(() => {
    const setupFactory = async () => {
      const factoryUsersCP = Number(await readFactory("usersCP"));

      if (factoryUsersCP !== usersCP) {
        // Fetch all registered users
        dispatch(updateUsersCP(factoryUsersCP));
        const users = await readFactory("getUsers", [usersCP, factoryUsersCP]);
        console.log("from factory contract -> Factory Users:", users);
        dispatch(updateUsers(users as Address[]));
      }
    };

    setupFactory();
  }, [dispatch, usersCP]);
};
