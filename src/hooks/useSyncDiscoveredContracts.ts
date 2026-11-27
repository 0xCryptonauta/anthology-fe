import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUsersContractsToStore } from "@store/utils/thunks";
import type { Address } from "@src/types/common";
import type { ContractsSyncStatus } from "./useSyncUserContracts";

export const useSyncDiscoveredContracts = (usersReady: boolean) => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.factory);
  const [status, setStatus] = useState<ContractsSyncStatus>("idle");
  const [attempt, setAttempt] = useState(0);
  const requestSequence = useRef(0);
  const syncedSignature = useRef<string | null>(null);

  const reload = useCallback(() => {
    syncedSignature.current = null;
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!usersReady) {
      setStatus("idle");
      return;
    }

    if (users.length === 0) {
      setStatus("success");
      return;
    }

    const signature = [...users].sort().join("|");
    if (syncedSignature.current === signature) {
      setStatus("success");
      return;
    }

    const requestId = ++requestSequence.current;
    syncedSignature.current = signature;
    setStatus("loading");
    dispatch(syncUsersContractsToStore(users as Address[]))
      .unwrap()
      .then(() => {
        if (requestSequence.current === requestId) setStatus("success");
      })
      .catch(() => {
        if (requestSequence.current === requestId) {
          syncedSignature.current = null;
          setStatus("error");
        }
      });

    return () => {
      requestSequence.current += 1;
    };
  }, [attempt, dispatch, users, usersReady]);

  return { status, reload };
};
