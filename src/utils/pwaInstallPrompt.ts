/**
 * PWA install prompt plumbing.
 *
 * The browser owns the actual install UI; this module keeps the captured
 * `beforeinstallprompt` event (or the newer `navigator.install()` entry point)
 * and exposes it to our own sheet. Capturing the event must happen before
 * React mounts, so `index.html` stashes it on `window`; this module picks it up
 * on init and keeps listening for later events.
 */

export const PWA_INSTALL_PROMPT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
/** Let the user land before the sheet appears. */
export const PWA_INSTALL_PROMPT_DELAY_MS = 15_000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

export interface InstallPromptVisibilityInput {
  onHome: boolean;
  installed: boolean;
  canInstall: boolean;
  dismissedAt: number | null;
  now: number;
}

/** Pure gate so the weekly schedule is testable without a browser. */
export const shouldShowInstallPrompt = ({
  onHome,
  installed,
  canInstall,
  dismissedAt,
  now,
}: InstallPromptVisibilityInput): boolean => {
  if (!onHome || installed || !canInstall) return false;
  if (dismissedAt === null) return true;
  return now - dismissedAt >= PWA_INSTALL_PROMPT_COOLDOWN_MS;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installedByEvent = false;
let initialized = false;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  const displayMode = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;
  return Boolean(displayMode || iosStandalone);
};

type InstallCapableNavigator = Navigator & {
  install?: () => Promise<void>;
};

const getNavigatorInstall = (): (() => Promise<void>) | null => {
  if (typeof navigator === "undefined") return null;
  const install = (navigator as InstallCapableNavigator).install;
  return typeof install === "function" ? install.bind(navigator) : null;
};

export const getCanInstall = (): boolean =>
  Boolean(deferredPrompt || getNavigatorInstall());

export const isAppInstalled = (): boolean =>
  installedByEvent || isStandalone();

export const subscribePwaInstall = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const markPwaInstalled = () => {
  installedByEvent = true;
  deferredPrompt = null;
  notify();
};

const capturePrompt = (event: Event) => {
  event.preventDefault();
  deferredPrompt = event as BeforeInstallPromptEvent;
  notify();
};

export const initPwaInstallPrompt = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // index.html may have captured the event before this module loaded.
  if (window.__deferredPwaInstallPrompt) {
    capturePrompt(window.__deferredPwaInstallPrompt);
  }

  window.addEventListener("beforeinstallprompt", capturePrompt);
  window.addEventListener("appinstalled", markPwaInstalled);
};

/**
 * Calls `navigator.install()` when the browser has it, otherwise replays the
 * captured `beforeinstallprompt` event. The event is single-use, so it is
 * cleared before awaiting the user's choice.
 */
export const promptInstall = async (): Promise<InstallOutcome> => {
  const navigatorInstall = getNavigatorInstall();

  if (navigatorInstall) {
    try {
      await navigatorInstall();
      markPwaInstalled();
      return "accepted";
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return "dismissed";
      console.error("PWA install failed", error);
      return "unavailable";
    }
  }

  const promptEvent = deferredPrompt;
  if (!promptEvent) return "unavailable";

  deferredPrompt = null;
  notify();

  try {
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") markPwaInstalled();
    return choice.outcome;
  } catch (error) {
    console.error("PWA install prompt failed", error);
    return "unavailable";
  }
};
