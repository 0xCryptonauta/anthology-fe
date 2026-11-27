const MAX_BROWSER_WALLETS = 5;

type BrowserWalletCandidate = {
  id: string;
  type: string;
};

/**
 * Injected wallets are only rendered on desktop. EIP-6963 wallets are
 * preferred; the generic wagmi connector is a fallback for older providers
 * that expose only window.ethereum.
 */
export const selectBrowserWalletConnectors = <
  T extends BrowserWalletCandidate
>(
  connectors: readonly T[],
  {
    isMobile,
    hasLegacyProvider,
  }: {
    isMobile: boolean;
    hasLegacyProvider: boolean;
  }
): T[] => {
  if (isMobile) return [];

  const announced = connectors
    .filter(
      (connector) => connector.type === "injected" && connector.id !== "injected"
    )
    .slice(0, MAX_BROWSER_WALLETS);

  if (announced.length > 0) return announced;
  if (!hasLegacyProvider) return [];

  const generic = connectors.find(
    (connector) => connector.type === "injected" && connector.id === "injected"
  );

  return generic ? [generic] : [];
};
