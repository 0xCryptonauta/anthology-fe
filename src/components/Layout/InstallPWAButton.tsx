import { useTranslation } from "@src/i18n/useTranslation";
import { usePwaInstallState } from "@src/hooks/usePwaInstallState";
import { promptInstall } from "@src/utils/pwaInstallPrompt";

const InstallPWAButton = () => {
  const { t } = useTranslation();
  const { canInstall, installed } = usePwaInstallState();

  const available = canInstall && !installed;

  const handleInstallClick = async () => {
    if (!available) return;
    await promptInstall();
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
      {installed
        ? t("install.installed")
        : available
        ? t("install.button")
        : t("install.unavailable")}
    </button>
  );
};

export default InstallPWAButton;
