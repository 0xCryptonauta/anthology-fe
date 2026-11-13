import type { Address } from "@src/types/common";
import type { ReceivedFrom } from "@src/types/connect";
import { useAppSelector } from "@src/store/utils/hooks";

export const useReceivedFrom = (contract: Address): ReceivedFrom | undefined =>
  useAppSelector((state) => state.localAnthology.receivedFrom?.[contract]);

export const useIsReadOnlyAnthology = (contract: Address): boolean =>
  Boolean(useReceivedFrom(contract));
