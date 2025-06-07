import { Address } from "@src/types/common";

export const isLocalAnthology = (contractAddr: Address): boolean => {
  if (contractAddr.length === 22) {
    return true;
  } else {
    return false;
  }
};
