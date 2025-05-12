import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getCurrentConfig } from "@src/contract-functions/helpers";

const queryClient = new QueryClient();

export function ContextWagmiProvider({ children }: { children: ReactNode }) {
  const config = getCurrentConfig();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
