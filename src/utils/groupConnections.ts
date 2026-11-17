import type {
  Address,
  AnthologyType,
  ContractTitlesType,
} from "@src/types/common";
import type { LocalId, ReceivedFrom } from "@src/types/connect";

export interface ConnectionAnthology {
  address: Address;
  title: string;
  memoirCount: number;
  receivedAt: number;
}

export interface ConnectionGroup {
  deviceId: LocalId;
  nametag: string;
  firstConnectedAt: number;
  lastConnectedAt: number;
  anthologies: ConnectionAnthology[];
}

interface ConnectionGroupAccumulator extends ConnectionGroup {
  latestAt: number;
}

export const groupConnections = (
  receivedFrom: Record<Address, ReceivedFrom>,
  anthologies: AnthologyType,
  titles: ContractTitlesType
): ConnectionGroup[] => {
  const groups = new Map<LocalId, ConnectionGroupAccumulator>();

  for (const [address, meta] of Object.entries(receivedFrom) as [
    Address,
    ReceivedFrom
  ][]) {
    const memoirs = anthologies[address];
    if (!memoirs) continue;

    let group = groups.get(meta.deviceId);

    if (!group) {
      group = {
        deviceId: meta.deviceId,
        nametag: meta.nametag,
        firstConnectedAt: meta.receivedAt,
        lastConnectedAt: meta.receivedAt,
        anthologies: [],
        latestAt: meta.receivedAt,
      };
      groups.set(meta.deviceId, group);
    } else {
      group.firstConnectedAt = Math.min(
        group.firstConnectedAt,
        meta.receivedAt
      );
      group.lastConnectedAt = Math.max(
        group.lastConnectedAt,
        meta.receivedAt
      );

      if (meta.receivedAt >= group.latestAt) {
        group.nametag = meta.nametag;
        group.latestAt = meta.receivedAt;
      }
    }

    group.anthologies.push({
      address,
      title: titles[address] || address,
      memoirCount: memoirs.length,
      receivedAt: meta.receivedAt,
    });
  }

  return Array.from(groups.values())
    .map((group) => ({
      deviceId: group.deviceId,
      nametag: group.nametag,
      firstConnectedAt: group.firstConnectedAt,
      lastConnectedAt: group.lastConnectedAt,
      anthologies: group.anthologies.sort(
        (left, right) => right.receivedAt - left.receivedAt
      ),
    }))
    .sort((left, right) => right.lastConnectedAt - left.lastConnectedAt);
};
