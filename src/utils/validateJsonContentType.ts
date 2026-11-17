import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { localAnthologyState } from "@src/store/slices/localAnthologySlice";
import { Address, SkinType } from "@src/types/common";
import type { SharedBy } from "@src/types/connect";

type LocalMemoryType = {
  users: Address[]; //local users is just one, or not?
  userContracts: { [key: Address]: Address[] };
  contractsTitles: { [key: Address]: string };
};

type LocalAnthologyType = {
  contractAddr: Address;
  title: string;
  anthology: MemoirInterface[];
  defaultSkin: SkinType;
};

/** The five fields that leave the device. Provenance is deliberately excluded. */
export type LocalMemoryPayload = Pick<
  localAnthologyState,
  "users" | "userContracts" | "contractsTitles" | "anthologies" | "defaultSkin"
>;

export type LoadedJson = {
  sharedBy?: SharedBy;
  sharedAt?: number;
  discoveries?: LocalMemoryType;
  localMemory?: LocalMemoryPayload;
  anthology?: LocalAnthologyType;
};

export const validateJsonContentType = (
  data: LoadedJson
): {
  hasDiscovery: boolean;
  hasLocal: boolean;
  isOneAnthology: boolean;
} => {
  const hasDiscovery =
    Array.isArray(data.discoveries?.users) &&
    typeof data.discoveries?.userContracts === "object" &&
    data.discoveries?.userContracts !== null &&
    typeof data.discoveries?.contractsTitles === "object" &&
    data.discoveries?.contractsTitles !== null;

  const hasLocal =
    typeof data.localMemory === "object" &&
    data.localMemory !== null &&
    Array.isArray(data.localMemory?.users) &&
    typeof data.localMemory?.userContracts === "object" &&
    typeof data.localMemory?.contractsTitles === "object" &&
    typeof data.localMemory?.anthologies === "object" &&
    typeof data.localMemory?.defaultSkin === "object";

  const isOneAnthology =
    Array.isArray(data.anthology?.anthology) &&
    typeof data.anthology?.contractAddr === "string" &&
    data.anthology?.contractAddr !== null;
  /*     typeof data.anthology?.title === "string" &&
    data.anthology?.title !== null &&
    typeof data.anthology?.defaultSkin === "string" &&
    data.anthology?.defaultSkin !== null; */

  return { hasDiscovery, hasLocal, isOneAnthology };
};
