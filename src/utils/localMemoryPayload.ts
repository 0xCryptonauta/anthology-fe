import type { localAnthologyState } from "@src/store/slices/localAnthologySlice";
import type { Address } from "@src/types/common";
import type { ReceivedFrom } from "@src/types/connect";
import type { LocalMemoryPayload } from "@src/utils/validateJsonContentType";

/**
 * Connected anthologies are not re-shareable. Keep the own addresses and
 * report how many connected ones were skipped for the toast.
 */
export const filterShareableAddresses = (
  addresses: Address[],
  receivedFrom: Record<Address, ReceivedFrom>
): { shareable: Address[]; skipped: number } => {
  const shareable = addresses.filter((address) => !receivedFrom[address]);
  return { shareable, skipped: addresses.length - shareable.length };
};

export const pickLocalMemory = (
  local: localAnthologyState
): LocalMemoryPayload => ({
  users: local.users,
  userContracts: local.userContracts,
  contractsTitles: local.contractsTitles,
  anthologies: local.anthologies,
  defaultSkin: local.defaultSkin,
});
