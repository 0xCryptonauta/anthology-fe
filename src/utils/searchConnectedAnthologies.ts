import type { LocalId } from "@src/types/connect";
import type {
  ConnectionAnthology,
  ConnectionGroup,
} from "@src/utils/groupConnections";

export interface ConnectedAnthologyResult extends ConnectionAnthology {
  deviceId: LocalId;
  nametag: string;
}

/**
 * Flatten connected anthologies and match the raw title, which includes the
 * `[Category][Subcategory]` prefix. The normal grouped view is used when the
 * query is empty.
 */
export const searchConnectedAnthologies = (
  groups: ConnectionGroup[],
  query: string
): ConnectedAnthologyResult[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return groups
    .flatMap((group) =>
      group.anthologies.map((anthology) => ({
        ...anthology,
        deviceId: group.deviceId,
        nametag: group.nametag,
      }))
    )
    .filter((anthology) => anthology.title.toLowerCase().includes(needle))
    .sort((left, right) => left.title.localeCompare(right.title));
};
