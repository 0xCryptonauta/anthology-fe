import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { updateUsers, updateUsersCP } from "@store/slices/factorySlice";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import type { Address } from "@src/types/common";
import type { ContractsSyncStatus } from "./useSyncUserContracts";

export const useGetFactoryUsers = () => {
  const dispatch = useAppDispatch();
  const { users, usersCP } = useAppSelector((state) => state.factory);
  const [status, setStatus] = useState<ContractsSyncStatus>("loading");
  const requestSequence = useRef(0);

  const reload = useCallback(() => {
    const requestId = ++requestSequence.current;
    setStatus("loading");

    const fetchUsers = async () => {
      const checkpoint = await readFactory("usersCP");
      if (checkpoint === undefined) {
        throw new Error("Factory users checkpoint request failed");
      }

      const factoryUsersCP = Number(checkpoint);
      if (!Number.isSafeInteger(factoryUsersCP) || factoryUsersCP < 0) {
        throw new Error("Invalid factory users checkpoint");
      }

      const needsInitialSync = factoryUsersCP > 0 && users.length === 0;
      if (factoryUsersCP > usersCP || needsInitialSync) {
        const offset = needsInitialSync ? 0 : usersCP;
        const fetchedUsers = await readFactory("getUsers", [
          offset,
          factoryUsersCP - offset,
        ]);
        if (!Array.isArray(fetchedUsers)) {
          throw new Error("Factory users request failed");
        }

        dispatch(updateUsers(fetchedUsers as Address[]));
        dispatch(updateUsersCP(factoryUsersCP));
      }

      if (requestSequence.current === requestId) setStatus("success");
    };

    fetchUsers().catch(() => {
      if (requestSequence.current === requestId) setStatus("error");
    });
  }, [dispatch, users.length, usersCP]);

  useEffect(() => {
    reload();
    return () => {
      requestSequence.current += 1;
    };
  }, [reload]);

  return { status, reload };
};
