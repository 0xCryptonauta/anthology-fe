import { useCallback, useEffect, useRef, useState } from "react";
import { isAddress } from "viem";
import { useAppDispatch } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@store/utils/thunks";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import type { Address } from "@src/types/common";

export type ContractsSyncStatus = "idle" | "loading" | "success" | "error";

const isSyncableAddress = (userAddr: Address) =>
  userAddr !== LOCAL_USER_ADDR && isAddress(userAddr);

export const useSyncUserContracts = (userAddr: Address) => {
  const dispatch = useAppDispatch();
  const requestSequence = useRef(0);
  const [state, setState] = useState<{
    address: Address;
    status: ContractsSyncStatus;
  }>(() => ({
    address: userAddr,
    status: isSyncableAddress(userAddr) ? "loading" : "idle",
  }));

  const reload = useCallback(() => {
    const requestId = ++requestSequence.current;

    if (!isSyncableAddress(userAddr)) {
      setState({ address: userAddr, status: "idle" });
      return;
    }

    setState({ address: userAddr, status: "loading" });
    dispatch(syncUserContractsToStore(userAddr))
      .unwrap()
      .then(() => {
        if (requestSequence.current === requestId) {
          setState({ address: userAddr, status: "success" });
        }
      })
      .catch(() => {
        if (requestSequence.current === requestId) {
          setState({ address: userAddr, status: "error" });
        }
      });
  }, [dispatch, userAddr]);

  useEffect(() => {
    reload();
    return () => {
      requestSequence.current += 1;
    };
  }, [reload]);

  const status =
    state.address === userAddr
      ? state.status
      : isSyncableAddress(userAddr)
        ? "loading"
        : "idle";

  return { status, reload };
};
