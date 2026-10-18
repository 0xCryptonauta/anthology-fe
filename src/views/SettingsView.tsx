import InstallPWAButton from "@src/components/Layout/InstallPWAButton";
import { NetworkSettings } from "@src/components/Layout/NetworkSettings";
import { IconPathSwitcher } from "@src/components/Layout/IconPathSwitcher";

import { DownloadReduxStore } from "@src/components/Layout/DownloadReduxStore";
import { CacheStorageViewer } from "@src/components/Layout/CacheStorageViewer";
import { ClearCacheButton } from "@src/components/Layout/ClearCacheButton";
import { CleanReduxStore } from "@src/components/Layout/CleanReduxStore";
import { LoadReduxStore } from "@src/components/Layout/LoadReduxStore";
import { CategoryBackgroundsToggle } from "@src/components/Layout/CategoryBackgroundsToggle";
import { LanguageSelector } from "@src/components/Layout/LanguageSelector";
import { Seo } from "@components/Layout/Seo";
import { useTranslation } from "@src/i18n/useTranslation";

export const SettingsView = () => {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t("nav.settings")} description="Configure your Anthology experience" />
      <div
        style={{
          color: "white",
          height: "100%",
          textShadow: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          gap: "50px",
        }}
      >
        <LanguageSelector />
        <DownloadReduxStore />
        <CacheStorageViewer />
        <ClearCacheButton />
        <LoadReduxStore />
        <InstallPWAButton />
        <IconPathSwitcher />
        <CategoryBackgroundsToggle />
        <NetworkSettings />
      </div>

      <CleanReduxStore />
      </div>
    </>
  );
};
