import { describe, expect, test } from "bun:test";
import { selectBrowserWalletConnectors } from "../src/utils/browserWallets";

const connector = (id: string, type = "injected") => ({ id, type });

describe("selectBrowserWalletConnectors", () => {
  test("returns announced injected wallets without the generic or WalletConnect connectors", () => {
    const result = selectBrowserWalletConnectors(
      [
        connector("io.metamask"),
        connector("injected"),
        connector("walletConnect", "walletConnect"),
      ],
      { isMobile: false, hasLegacyProvider: true }
    );

    expect(result.map(({ id }) => id)).toEqual(["io.metamask"]);
  });

  test("limits announced injected wallets to five", () => {
    const result = selectBrowserWalletConnectors(
      ["one", "two", "three", "four", "five", "six"].map((id) =>
        connector(id)
      ),
      { isMobile: false, hasLegacyProvider: false }
    );

    expect(result.map(({ id }) => id)).toEqual([
      "one",
      "two",
      "three",
      "four",
      "five",
    ]);
  });

  test("uses the generic injected connector when only a legacy provider exists", () => {
    const result = selectBrowserWalletConnectors([connector("injected")], {
      isMobile: false,
      hasLegacyProvider: true,
    });

    expect(result.map(({ id }) => id)).toEqual(["injected"]);
  });

  test("does not expose a generic injected connector without a provider", () => {
    expect(
      selectBrowserWalletConnectors([connector("injected")], {
        isMobile: false,
        hasLegacyProvider: false,
      })
    ).toEqual([]);
  });

  test("suppresses all injected wallets on mobile", () => {
    expect(
      selectBrowserWalletConnectors(
        [connector("io.metamask"), connector("injected")],
        { isMobile: true, hasLegacyProvider: true }
      )
    ).toEqual([]);
  });
});
