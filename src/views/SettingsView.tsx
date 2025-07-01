import InstallPWAButton from "@src/components/Layout/InstallPWAButton";
import { NetworkSettings } from "@src/components/Layout/NetworkSettings";
import { IconPathSwitcher } from "@src/components/Layout/IconPathSwitcher";

import { DownloadReduxStore } from "@src/components/Layout/DownloadReduxStore";
import { CleanReduxStore } from "@src/components/Layout/CleanReduxStore";
import { LoadReduxStore } from "@src/components/Layout/LoadReduxStore";

export const SettingsView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "100%",
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
        <LoadReduxStore />
        <InstallPWAButton />
        <IconPathSwitcher />
        <NetworkSettings />
      </div>

      <CleanReduxStore />
    </div>
  );
};
