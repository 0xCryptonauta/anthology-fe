export type CurrentPaths =
  | "factory"
  | `user/${string}`
  | `contract/${string}`
  | "telepathy";

export type Address = `0x${string}`;

export type SkinType =
  | "media"
  | "json"
  | "text"
  | "playlist"
  | "list"
  | "\0default\0";
