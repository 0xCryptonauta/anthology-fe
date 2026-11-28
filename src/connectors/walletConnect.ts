/**
 * Lazy entry point for the WalletConnect connector.
 *
 * Import it with `await import("@src/connectors/walletConnect")` so the
 * connector and the large WalletConnect/AppKit vendor chunk stay out of the
 * initial page load and only download when a WalletConnect session is
 * actually used.
 */
export { walletConnect } from "@wagmi/connectors/walletConnect";
