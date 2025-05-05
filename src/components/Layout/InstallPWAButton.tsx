import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    // Check if already installed (on iOS or others)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        console.log("PWA installation accepted");
      } else {
        console.log("PWA installation dismissed");
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <div
      style={{
        width: "fit-content",
        height: "fit-content",
        padding: "10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span>Install App: </span>
      <span
        role="button"
        tabIndex={0}
        onClick={handleInstallClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleInstallClick();
        }}
        className="text-2xl cursor-pointer select-none hover:opacity-80 transition"
        style={{ fontSize: "25px" }}
      >
        📲
      </span>

      <InstallPWAButton />
    </div>
  );
};

export default InstallPWAButton;
