import InstallPWAButton from "@src/components/Layout/InstallPWAButton";
import { NetworkSettings } from "@src/components/Layout/NetworkSettings";
import { IconPathSwitcher } from "@src/components/Layout/IconPathSwitcher";

import { DownloadReduxStore } from "@src/components/Layout/DownloadReduxStore";
import { CacheStorageViewer } from "@src/components/Layout/CacheStorageViewer";
import { ClearCacheButton } from "@src/components/Layout/ClearCacheButton";
import { CleanReduxStore } from "@src/components/Layout/CleanReduxStore";
import { LoadReduxStore } from "@src/components/Layout/LoadReduxStore";
import { CategoryBackgroundsToggle } from "@src/components/Layout/CategoryBackgroundsToggle";
import { ThemeToggle } from "@src/components/Layout/ThemeToggle";
import { Seo } from "@components/Layout/Seo";
import { useTheme } from "@src/hooks/useTheme";

export const SettingsView = () => {
  const { isLight } = useTheme();

  return (
    <>
      <Seo title="Settings" description="Configure your Anthology experience" />
      <div
        style={{
          color: isLight ? "#213547" : "white",
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
        <DownloadReduxStore />
        <CacheStorageViewer />
        <ClearCacheButton />
        <LoadReduxStore />
        <InstallPWAButton />
        <IconPathSwitcher />
        <CategoryBackgroundsToggle />
        <ThemeToggle />
        <NetworkSettings />
      </div>

      <CleanReduxStore />
      </div>
    </>
  );
};
