import { useEffect, useState } from "react";
import {
  getCanInstall,
  initPwaInstallPrompt,
  isAppInstalled,
  subscribePwaInstall,
} from "@utils/pwaInstallPrompt";

/**
 * Reactive view of the browser's install availability. Shared by the settings
 * button and the automatic install sheet so both stay in sync.
 */
export const usePwaInstallState = () => {
  const [canInstall, setCanInstall] = useState(() => getCanInstall());
  const [installed, setInstalled] = useState(() => isAppInstalled());

  useEffect(() => {
    initPwaInstallPrompt();

    const sync = () => {
      setCanInstall(getCanInstall());
      setInstalled(isAppInstalled());
    };

    sync();
    return subscribePwaInstall(sync);
  }, []);

  return { canInstall, installed };
};
