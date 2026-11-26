import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentConfig } from "@src/contract-functions/helpers";

const queryClient = new QueryClient();

/**
 * wagmi context with no WalletConnect connector registered.
 *
 * The WalletConnect provider is a ~294 kB gzipped chunk that the service
 * worker deliberately keeps out of its precache. Nothing web3 is downloaded
 * until the user clicks connect: that handler lazily imports the connector,
 * which silently re-enables a stored session or opens the bundled pairing
 * modal for a fresh one. There is no boot-time reconnect either — reloading
 * never pulls wallet code or opens relay connections.
 */
export function ContextWagmiProvider({ children }: { children: ReactNode }) {
  const [config] = useState(() => getCurrentConfig());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
