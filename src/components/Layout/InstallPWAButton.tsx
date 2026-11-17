import { useEffect, useState } from "react";
import { useTranslation } from "@src/i18n/useTranslation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const InstallPWAButton = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const available = Boolean(deferredPrompt) && !isInstalled;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <button
      type="button"
      onClick={handleInstallClick}
      disabled={!available}
      style={{
        minHeight: "40px",
        padding: "7px 12px",
        borderRadius: "8px",
        border: "1px solid #30363d",
        backgroundColor: available ? "#238636" : "#21262d",
        color: "white",
        fontSize: "13px",
        fontWeight: 500,
        cursor: available ? "pointer" : "not-allowed",
        opacity: available ? 1 : 0.6,
      }}
    >
      {isInstalled
        ? t("install.installed")
        : available
        ? t("install.button")
        : t("install.unavailable")}
    </button>
  );
};

export default InstallPWAButton;
