import { Address } from "viem";

type validQRReturn = {
  type: "user" | "anthology";
  address: Address;
};

export const isQrReturnValid = (obj: string) => {
  let parsed: string | validQRReturn;
  try {
    parsed = JSON.parse(obj);
  } catch {
    return false;
  }
  return (
    parsed !== null &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    typeof parsed.type === "string" &&
    typeof parsed.address === "string"
  );
};
