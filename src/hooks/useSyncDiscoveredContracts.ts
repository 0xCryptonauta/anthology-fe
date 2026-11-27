import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUsersContractsToStore } from "@store/utils/thunks";
import type { Address } from "@src/types/common";
import type { ContractsSyncStatus } from "./useSyncUserContracts";

export const useSyncDiscoveredContracts = (usersReady: boolean) => {
  const dispatch = useAppDispatch();
  const { users, userContracts } = useAppSelector((state) => state.factory);
  const [status, setStatus] = useState<ContractsSyncStatus>("idle");
  const [attempt, setAttempt] = useState(0);
  const requestSequence = useRef(0);

  const reload = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!usersReady) {
      setStatus("idle");
      return;
    }

    const missingUsers = users.filter(
      (user) => userContracts[user] === undefined
    );
    if (missingUsers.length === 0) {
      setStatus("success");
      return;
    }

    const requestId = ++requestSequence.current;
    setStatus("loading");
    dispatch(syncUsersContractsToStore(missingUsers as Address[]))
      .unwrap()
      .then(() => {
        if (requestSequence.current === requestId) setStatus("success");
      })
      .catch(() => {
        if (requestSequence.current === requestId) setStatus("error");
      });

    return () => {
      requestSequence.current += 1;
    };
  }, [attempt, dispatch, userContracts, users, usersReady]);

  return { status, reload };
};
