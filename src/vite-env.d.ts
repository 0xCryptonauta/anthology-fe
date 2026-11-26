/// <reference types="vite/client" />

interface Window {
  /** Stashed by the inline listener in index.html before React mounts. */
  __deferredPwaInstallPrompt?: Event;
}
