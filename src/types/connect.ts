export type LocalId = `1x${string}`;

export interface SharedBy {
  deviceId: LocalId;
  nametag: string;
}

export interface ReceivedFrom {
  deviceId: LocalId;
  nametag: string;
  receivedAt: number;
}
