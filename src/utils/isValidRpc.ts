import { arbitrum } from "viem/chains";

const RPC_VALIDATION_TIMEOUT_MS = 5000;

export const isValidRpc = async (rpc: string) => {
  if (rpc === "") {
    return true;
  }
  try {
    const parsed = new URL(rpc);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
  } catch {
    return false;
  }

  const payload = {
    jsonrpc: "2.0",
    method: "eth_chainId",
    params: [],
    id: 1,
  };

  try {
    const response = await fetch(rpc, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(RPC_VALIDATION_TIMEOUT_MS),
    });

    if (response.ok) {
      const data = (await response.json()) as { result?: unknown };
      if (data.result === `0x${arbitrum.id.toString(16)}`) {
        console.log("RPC is valid");
        return true;
      }
    }
  } catch (error) {
    console.error(`Error validating RPC: ${error}`);
  }
  return false;
};
