/**
 * Wallets offered by the WalletConnect pairing modal.
 *
 * The provider's `qrModalOptions.explorerRecommendedWalletIds` only pins
 * favourites; AppKit still lists the rest of the WalletGuide registry in
 * "Search Wallet". The real allowlist is AppKit's `includeWalletIds`.
 * `@walletconnect/ethereum-provider` does not forward that option, so
 * `applyWalletConnectAllowlist` sets it on the bundled AppKit instance just
 * before the modal opens.
 *
 * Injected wallets are intentionally not filtered: those are already
 * installed in the user's browser and do not come from the explorer.
 *
 * IDs come from WalletGuide (https://walletguide.walletconnect.com/) and are
 * pinned so a registry reshuffle cannot silently change the list.
 */
export const WALLETCONNECT_ALLOWED_WALLETS = [
  {
    id: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    name: "MetaMask",
  },
  {
    id: "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    name: "Trust Wallet",
  },
  {
    id: "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    name: "Rainbow",
  },
  {
    id: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
    name: "Base (formerly Coinbase Wallet)",
  },
  {
    id: "18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1",
    name: "Rabby",
  },
  {
    id: "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18",
    name: "Zerion",
  },
  {
    id: "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
    name: "Ledger Wallet",
  },
  {
    id: "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",
    name: "Safe",
  },
  {
    id: "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a",
    name: "Uniswap Wallet",
  },
  {
    id: "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
    name: "OKX Wallet",
  },
  {
    id: "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
    name: "Bitget Wallet",
  },
  {
    id: "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66",
    name: "TokenPocket",
  },
  {
    id: "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef",
    name: "imToken",
  },
  {
    id: "445ced0f482742632dfa6684f802eb1a2bb3cb97531bd06e02fb297c6ad21de1",
    name: "Family",
  },
  {
    id: "372945354184bfbf3eb51e38d8fafde15a4bc11b88904334e7bad7c8229e6bb1",
    name: "Bitso Web3 Wallet",
  },
] as const;

export const WALLETCONNECT_ALLOWED_WALLET_IDS = WALLETCONNECT_ALLOWED_WALLETS.map(
  ({ id }) => id
);

type AppKitAllowlistOptions = {
  includeWalletIds: string[];
  featuredWalletIds: string[];
  allWallets: "ONLY_MOBILE";
};

type AppKitModalLike = {
  updateOptions?: (options: AppKitAllowlistOptions) => void;
};

export type WalletConnectProviderLike = {
  modal?: AppKitModalLike;
};

/**
 * Restricts AppKit's explorer to `WALLETCONNECT_ALLOWED_WALLETS`.
 *
 * Must run after the provider creates its AppKit instance and before
 * `provider.connect()` opens the modal: opening the modal prefetches wallets
 * with the current options. Returns false when the instance or method is not
 * available, leaving the normal explorer list in place rather than breaking
 * the connection flow.
 */
export const applyWalletConnectAllowlist = (
  provider: WalletConnectProviderLike | null | undefined
): boolean => {
  const modal = provider?.modal;
  if (!modal || typeof modal.updateOptions !== "function") {
    return false;
  }

  modal.updateOptions({
    includeWalletIds: [...WALLETCONNECT_ALLOWED_WALLET_IDS],
    featuredWalletIds: [...WALLETCONNECT_ALLOWED_WALLET_IDS],
    // Desktop uses the universal QR; the "Search Wallet" entry is only
    // meaningful on mobile, where it opens the wallet deep-link chooser.
    // Keeping it hidden on desktop also avoids an AppKit counter that can
    // briefly render "0" before the featured wallets arrive.
    allWallets: "ONLY_MOBILE",
  });
  return true;
};
