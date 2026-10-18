import { Address } from "viem";

export type ValidQRReturn = {
  type: "user" | "anthology";
  address: Address;
};

export const parseQrReturn = (raw: string): ValidQRReturn | null => {
  const trimmed = raw.trim();

  // 1. Check URL format (e.g., https://memory.inbytes.xyz/?contract=0x... or /?user=0x...)
  try {
    const url = new URL(trimmed);
    const contractParam =
      url.searchParams.get("contract") || url.searchParams.get("anthology");
    if (contractParam) {
      return { type: "anthology", address: contractParam as Address };
    }
    const userParam = url.searchParams.get("user");
    if (userParam) {
      return { type: "user", address: userParam as Address };
    }
  } catch {
    // Not a full URL, try JSON next
  }

  // 2. Check legacy JSON format: {"type":"anthology","address":"0x..."}
  try {
    const parsed = JSON.parse(trimmed);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.type === "user" || parsed.type === "anthology") &&
      typeof parsed.address === "string"
    ) {
      return { type: parsed.type, address: parsed.address as Address };
    }
  } catch {
    // Not valid JSON
  }

  return null;
};

export const isQrReturnValid = (obj: string) => {
  return parseQrReturn(obj) !== null;
};
