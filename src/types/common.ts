export type ActiveView =
  | "deploy"
  | "factory"
  | `user/${string}`
  | `contract/${string}`
  | "";
