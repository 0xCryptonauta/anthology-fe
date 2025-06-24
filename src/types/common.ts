import { MemoirInterface } from "@src/store/slices/anthologySlice";

export type CurrentPaths =
  | "factory"
  | `user/${string}`
  | `contract/${string}`
  | "discover";

export type Address = `0x${string}`;

export type SkinType =
  | "media"
  | "json"
  | "text"
  | "playlist"
  | "list"
  | "\0default\0";

export type AnthologyType = {
  [key: Address]: MemoirInterface[];
};

export type ContractTitlesType = {
  [key: Address]: string;
};

export type UserContractsType = {
  [key: Address]: Address[];
};
