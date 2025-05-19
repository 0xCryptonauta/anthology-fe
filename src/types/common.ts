export type ActiveView =
  | "deploy"
  | "factory"
  | `user/${string}`
  | `contract/${string}`
  | "";

export type Address = `0x${string}`;

export type SkinType =
  | "media"
  | "json"
  | "text"
  | "playlist"
  | "list"
  | "\0default\0";
