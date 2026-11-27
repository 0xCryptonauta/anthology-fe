import { describe, expect, test } from "bun:test";
import { networks } from "../src/wagmiConfig";

describe("wagmi RPC configuration", () => {
  test("uses Arbitrum's public RPC when no RPC is configured", () => {
    expect(networks[0].rpcUrls.default.http).toEqual([
      "https://arb1.arbitrum.io/rpc",
    ]);
  });
});
