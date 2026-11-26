import { UserRejectedRequestError } from "viem";

/**
 * Classifies the failures a wallet-connect click can produce so the UI can
 * react without guessing:
 *
 * - "offline": the WalletConnect vendor chunk could not be downloaded. It is
 *   deliberately kept out of the service-worker precache, so a user without
 *   network sees this instead of a silently dead button.
 * - "rejected": the user closed the pairing modal or declined in their wallet.
 *   Not an error worth reporting.
 * - "failed": anything else (relay/timeout/rpc) — surfaced as a toast.
 */
export type WalletConnectErrorKind = "offline" | "rejected" | "failed";

const OFFLINE_MESSAGE_PATTERNS = [
  // Chrome
  /failed to fetch dynamically imported module/i,
  // Firefox
  /error loading dynamically imported module/i,
  // Safari
  /importing a module script failed/i,
];

export const classifyWalletConnectError = (
  error: unknown
): WalletConnectErrorKind => {
  if (error instanceof UserRejectedRequestError) return "rejected";

  if (typeof error === "object" && error !== null) {
    const { name, code, message } = error as {
      name?: unknown;
      code?: unknown;
      message?: unknown;
    };

    // Cross-realm or wrapped rejections (JSON-RPC error code 4001).
    if (name === "UserRejectedRequestError" || code === 4001) {
      return "rejected";
    }

    if (
      typeof message === "string" &&
      OFFLINE_MESSAGE_PATTERNS.some((pattern) => pattern.test(message))
    ) {
      return "offline";
    }
  }

  return "failed";
};
