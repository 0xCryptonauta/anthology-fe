export type ActiveView =
  | "deploy"
  | "factory"
  | `user/${string}`
  | `contract/${string}`
  | "";

export type Address = `0x${string}`;
