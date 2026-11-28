import { describe, expect, test } from "bun:test";
import {
  applyWalletConnectAllowlist,
  WALLETCONNECT_ALLOWED_WALLET_IDS,
  WALLETCONNECT_ALLOWED_WALLETS,
} from "../src/utils/walletConnectAllowlist";

describe("WalletConnect allowlist", () => {
  test("pins 15 unique WalletGuide ids", () => {
    expect(WALLETCONNECT_ALLOWED_WALLETS).toHaveLength(15);
    expect(new Set(WALLETCONNECT_ALLOWED_WALLET_IDS).size).toBe(15);
    expect(
      WALLETCONNECT_ALLOWED_WALLET_IDS.every((id) => /^[0-9a-f]{64}$/.test(id))
    ).toBe(true);
  });

  test("sets both AppKit allowlist options", () => {
    const calls: unknown[] = [];
    const provider = {
      modal: {
        updateOptions: (options: unknown) => {
          calls.push(options);
        },
      },
    };

    expect(applyWalletConnectAllowlist(provider)).toBe(true);
    expect(calls).toEqual([
      {
        includeWalletIds: WALLETCONNECT_ALLOWED_WALLET_IDS,
        featuredWalletIds: WALLETCONNECT_ALLOWED_WALLET_IDS,
        allWallets: "ONLY_MOBILE",
      },
    ]);
  });

  test("leaves the flow intact when the AppKit instance is unavailable", () => {
    expect(applyWalletConnectAllowlist(undefined)).toBe(false);
    expect(applyWalletConnectAllowlist(null)).toBe(false);
    expect(applyWalletConnectAllowlist({})).toBe(false);
    expect(applyWalletConnectAllowlist({ modal: {} })).toBe(false);
  });
});
