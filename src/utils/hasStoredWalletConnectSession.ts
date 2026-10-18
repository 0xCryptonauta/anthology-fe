/**
 * Reports whether a WalletConnect session is persisted in localStorage.
 *
 * WalletConnect's core stores data under `wc@2:` keys; a non-empty
 * `wc@2:…//session` entry means the provider can actually reconnect. The
 * WalletConnect connector pulls in a large JS bundle (~315 kB gzipped), so
 * the app only loads it when such a session exists.
 */
export const hasStoredWalletConnectSession = (): boolean => {
  try {
    return Object.keys(window.localStorage).some((key) => {
      if (!key.startsWith("wc@2:") || !key.endsWith("//session")) return false;

      const value = window.localStorage.getItem(key);
      if (!value) return false;

      try {
        const sessions = JSON.parse(value) as unknown;
        return Array.isArray(sessions) && sessions.length > 0;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
};
