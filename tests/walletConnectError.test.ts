import { describe, expect, test } from "bun:test";
import { UserRejectedRequestError } from "viem";
import { classifyWalletConnectError } from "../src/utils/walletConnectError";

describe("classifyWalletConnectError", () => {
  test("classifies Chrome dynamic-import failures as offline", () => {
    const error = new TypeError(
      "Failed to fetch dynamically imported module: https://memory.inbytes.xyz/assets/walletconnect-vendor-abc123.js"
    );
    expect(classifyWalletConnectError(error)).toBe("offline");
  });

  test("classifies Firefox dynamic-import failures as offline", () => {
    const error = new Error(
      "error loading dynamically imported module (importing module failed)"
    );
    expect(classifyWalletConnectError(error)).toBe("offline");
  });

  test("classifies Safari module-script failures as offline", () => {
    const error = new Error("Importing a module script failed.");
    expect(classifyWalletConnectError(error)).toBe("offline");
  });

  test("classifies viem UserRejectedRequestError instances as rejected", () => {
    const error = new UserRejectedRequestError(new Error("user declined"));
    expect(classifyWalletConnectError(error)).toBe("rejected");
  });

  test("classifies errors named UserRejectedRequestError without instanceof", () => {
    const error = { name: "UserRejectedRequestError", message: "nope" };
    expect(classifyWalletConnectError(error)).toBe("rejected");
  });

  test("classifies JSON-RPC code 4001 as rejected", () => {
    const error = { code: 4001, message: "User rejected the request." };
    expect(classifyWalletConnectError(error)).toBe("rejected");
  });

  test("classifies unknown errors as failed", () => {
    expect(classifyWalletConnectError(new Error("boom"))).toBe("failed");
  });

  test("classifies thrown strings and null as failed", () => {
    expect(classifyWalletConnectError("some string")).toBe("failed");
    expect(classifyWalletConnectError(null)).toBe("failed");
    expect(classifyWalletConnectError(undefined)).toBe("failed");
  });
});
