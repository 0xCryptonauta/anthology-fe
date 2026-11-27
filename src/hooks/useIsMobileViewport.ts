import { useSyncExternalStore } from "react";

const MOBILE_VIEWPORT_QUERY = "(max-width: 768px)";

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;

const getServerSnapshot = () => false;

export const useIsMobileViewport = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
