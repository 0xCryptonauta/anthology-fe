import { ReactNode, useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentConfig } from "@src/contract-functions/helpers";
import { WALLETCONNECT_PARAMETERS } from "@src/wagmiConfig";
import { hasStoredWalletConnectSession } from "@src/utils/hasStoredWalletConnectSession";

const queryClient = new QueryClient();

export function ContextWagmiProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(() => getCurrentConfig());

  // The WalletConnect connector pulls in a large JS bundle, so it only loads
  // when a previous session exists and could actually reconnect.
  useEffect(() => {
    if (!hasStoredWalletConnectSession()) return;

    let cancelled = false;
    import("@src/connectors/walletConnect")
      .then(({ walletConnect }) => {
        if (cancelled) return;
        setConfig(getCurrentConfig(walletConnect(WALLETCONNECT_PARAMETERS)));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
