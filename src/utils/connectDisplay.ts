import type { LocalId } from "@src/types/connect";

/**
 * Display name for a contact. Duplicate nametags get the last three
 * characters of the device id so two "Ana" contacts stay distinguishable.
 */
export const formatContactName = (
  nametag: string,
  deviceId: LocalId,
  hasDuplicateNametag: boolean
): string =>
  hasDuplicateNametag ? `${nametag}:${deviceId.slice(-3)}` : nametag;
