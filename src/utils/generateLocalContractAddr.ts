import { Address } from "@src/types/common";

export const generateLocalContractAddr = () => {
  let hex = "";
  for (let i = 0; i < 20; i++) {
    // Generate a random hexadecimal digit (0-9, a-f)
    const randomHexDigit = Math.floor(Math.random() * 16).toString(16);
    hex += randomHexDigit;
  }
  return `0x${hex}` as Address;
};
