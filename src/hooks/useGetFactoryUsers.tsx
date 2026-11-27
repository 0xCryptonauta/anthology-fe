import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import {
  updateUsers,
  updateUsersSyncedCP,
} from "@store/slices/factorySlice";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import { getUsersFetchPlan } from "@src/utils/factoryUsers";
import type { Address } from "@src/types/common";
import type { ContractsSyncStatus } from "./useSyncUserContracts";

export const useGetFactoryUsers = () => {
  const dispatch = useAppDispatch();
  const { users, usersSyncedCP } = useAppSelector((state) => state.factory);
  const [status, setStatus] = useState<ContractsSyncStatus>("loading");
  const requestSequence = useRef(0);
  const stateRef = useRef({ users, usersSyncedCP });
  stateRef.current = { users, usersSyncedCP };

  const reload = useCallback(() => {
    const requestId = ++requestSequence.current;
    setStatus("loading");

    const fetchUsers = async () => {
      const checkpoint = await readFactory("usersCP");
      if (checkpoint === undefined) {
        throw new Error("Factory users checkpoint request failed");
      }

      const plan = getUsersFetchPlan(
        Number(checkpoint),
        stateRef.current.usersSyncedCP,
        stateRef.current.users.length
      );

      if (plan) {
        const fetchedUsers = await readFactory("getUsers", [
          plan.offset,
          plan.limit,
        ]);
        if (!Array.isArray(fetchedUsers)) {
          throw new Error("Factory users request failed");
        }

        dispatch(updateUsers(fetchedUsers as Address[]));
        dispatch(updateUsersSyncedCP(plan.nextCP));
      }

      if (requestSequence.current === requestId) setStatus("success");
    };

    fetchUsers().catch(() => {
      if (requestSequence.current === requestId) setStatus("error");
    });
  }, [dispatch]);

  useEffect(() => {
    reload();
    return () => {
      requestSequence.current += 1;
    };
  }, [reload]);

  return { status, reload };
};
