export const isLocalAnthology = (contractAddr: string): boolean => {
  if (contractAddr.length === 22) {
    return true;
  } else {
    return false;
  }
};
