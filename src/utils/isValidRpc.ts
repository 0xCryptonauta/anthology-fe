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
    method: "eth_blockNumber",
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
    });

    if (response.ok) {
      const data = await response.json();
      if ("result" in data) {
        console.log("RPC is valid");
        return true;
      }
    }
  } catch (error) {
    console.error(`Error validating RPC: ${error}`);
  }
  return false;
};
