import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { updateUsers, updateUsersCP } from "@store/slices/factorySlice";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { useAppSelector } from "@src/store/utils/hooks";

export const useGetFactoryUsers = () => {
  const dispatch = useDispatch();
  const { usersCP } = useAppSelector((state) => state.factory);
  useEffect(() => {
    const setupFactory = async () => {
      let CP = 0;
      CP = Number(await readFactory("usersCP"));
      dispatch(updateUsersCP(CP));

      if (CP !== usersCP) {
        // Fetch all registered users
        const users = await readFactory("getUsers", [usersCP, CP]);
        console.log("Factory Users:", users);
        dispatch(updateUsers(users as []));
      }
    };

    setupFactory();
  }, [dispatch, usersCP]);
};
