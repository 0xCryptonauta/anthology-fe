/**
 * Lazy entry point for the WalletConnect connector.
 *
 * Import it with `await import("@src/connectors/walletConnect")` so the
 * connector and the large WalletConnect/AppKit vendor chunk stay out of the
 * initial page load and only download when a WalletConnect session is
 * actually used.
 */
import {
  walletConnect as createWalletConnect,
  type WalletConnectParameters,
} from "@wagmi/connectors/walletConnect";
import { applyWalletConnectAllowlist } from "@src/utils/walletConnectAllowlist";

/**
 * `@walletconnect/ethereum-provider` maps `explorerRecommendedWalletIds` to
 * AppKit's `featuredWalletIds`, but it never forwards `includeWalletIds` —
 * the option that actually keeps the rest of the WalletGuide registry out of
 * the "Search Wallet" view. Apply the allowlist to the bundled AppKit
 * instance as soon as `getProvider()` resolves. The provider creates that
 * instance during initialization and only opens the modal after `connect()`
 * calls `getProvider()`, so the prefetch runs with the allowlist in place.
 */
export const walletConnect = ((
  parameters: WalletConnectParameters
): ReturnType<typeof createWalletConnect> => {
  const createConnector = createWalletConnect(parameters);

  return (config) => {
    const connector = createConnector(config);
    const getProvider = connector.getProvider.bind(connector);

    connector.getProvider = async (options) => {
      const provider = await getProvider(options);
      const allowlistApplied = applyWalletConnectAllowlist(provider);

      if (!allowlistApplied && import.meta.env.DEV) {
        console.warn(
          "WalletConnect allowlist was not applied; the explorer will show all wallets."
        );
      }

      return provider;
    };

    return connector;
  };
}) as typeof createWalletConnect;
