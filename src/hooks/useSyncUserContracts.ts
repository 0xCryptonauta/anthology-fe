import { useCallback, useEffect, useRef, useState } from "react";
import { isAddress } from "viem";
import { useAppDispatch } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@store/utils/thunks";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import type { Address } from "@src/types/common";

export type ContractsSyncStatus = "idle" | "loading" | "success" | "error";

export const useSyncUserContracts = (userAddr: Address) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<ContractsSyncStatus>("idle");
  const requestSequence = useRef(0);

  const reload = useCallback(() => {
    const requestId = ++requestSequence.current;

    if (userAddr === LOCAL_USER_ADDR || !isAddress(userAddr)) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    dispatch(syncUserContractsToStore(userAddr))
      .unwrap()
      .then(() => {
        if (requestSequence.current === requestId) setStatus("success");
      })
      .catch(() => {
        if (requestSequence.current === requestId) setStatus("error");
      });
  }, [dispatch, userAddr]);

  useEffect(() => {
    reload();
    return () => {
      requestSequence.current += 1;
    };
  }, [reload]);

  return { status, reload };
};
