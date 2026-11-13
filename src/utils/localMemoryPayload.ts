import type { localAnthologyState } from "@src/store/slices/localAnthologySlice";
import type { LocalMemoryPayload } from "@src/utils/validateJsonContentType";

export const pickLocalMemory = (
  local: localAnthologyState
): LocalMemoryPayload => ({
  users: local.users,
  userContracts: local.userContracts,
  contractsTitles: local.contractsTitles,
  anthologies: local.anthologies,
  defaultSkin: local.defaultSkin,
});
