import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useAppSelector } from "@src/store/utils/hooks";
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
import { NametagSettings } from "@src/components/Layout/NametagSettings";
import { SettingsRow } from "@src/components/Layout/SettingsRow";
import { SettingsSection } from "@src/components/Layout/SettingsSection";
import { Seo } from "@components/Layout/Seo";
import { useTranslation } from "@src/i18n/useTranslation";

export const SettingsView = () => {
  const { t } = useTranslation();
  const { nametag } = useAppSelector((state) => state.connect);
  const { isConnected } = useAccount();

  return (
    <>
      <Seo
        title={t("nav.settings")}
        description="Configure your Anthology experience"
      />
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "24px 16px 48px",
          boxSizing: "border-box",
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1 style={{ margin: "0 0 4px", fontSize: "28px" }}>
          {t("nav.settings")}
        </h1>

        <SettingsSection
          title={t("settings.profile")}
          description={t("settings.profileDescription")}
          backgroundKey="settings-profile"
        >
          <SettingsRow
            first
            label={t("connect.nametagTitle")}
            description={nametag || t("settings.notSet")}
            control={<NametagSettings compact />}
          />
          <SettingsRow
            label={t("language.title")}
            control={<LanguageSelector />}
          />
        </SettingsSection>

        <SettingsSection
          title={t("settings.appearance")}
          description={t("settings.appearanceDescription")}
          backgroundKey="settings-appearance"
        >
          <SettingsRow
            first
            label={t("backgrounds.toggle")}
            control={<CategoryBackgroundsToggle showLabel={false} />}
          />
          {isConnected && (
            <SettingsRow
              label={t("iconPath.trigger")}
              control={<IconPathSwitcher />}
            />
          )}
        </SettingsSection>

        <SettingsSection
          title={t("settings.data")}
          description={t("settings.dataDescription")}
          backgroundKey="settings-data"
        >
          <SettingsRow
            first
            label={t("settings.localData")}
            control={<DownloadReduxStore />}
          />
          <SettingsRow
            label={t("settings.import")}
            control={<LoadReduxStore />}
          />
          <SettingsRow
            label={t("settings.storage")}
            control={<CacheStorageViewer />}
          />
          <SettingsRow
            label={t("settings.cache")}
            control={<ClearCacheButton />}
          />
        </SettingsSection>

        <SettingsSection
          title={t("settings.app")}
          description={t("settings.appDescription")}
          backgroundKey="settings-app"
        >
          <SettingsRow
            first
            label={t("settings.installApp")}
            control={<InstallPWAButton />}
          />
          <SettingsRow
            label={t("settings.privacySettings")}
            control={
              <Link
                to="/privacy"
                aria-label={t("settings.privacySettings")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "40px",
                  minHeight: "40px",
                  borderRadius: "8px",
                  border: "1px solid #30363d",
                  color: "#cbd5e1",
                  textDecoration: "none",
                  fontSize: "18px",
                }}
              >
                ›
              </Link>
            }
          />
        </SettingsSection>

        {isConnected && (
          <SettingsSection
            title={t("settings.advanced")}
            description={t("settings.advancedDescription")}
            backgroundKey="settings-advanced"
          >
            <SettingsRow
              first
              label={t("network.trigger")}
              control={<NetworkSettings />}
            />
          </SettingsSection>
        )}

        <SettingsSection
          title={t("settings.danger")}
          description={t("settings.dangerDescription")}
          danger
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <p style={{ margin: 0, color: "#fecaca", fontSize: "13px" }}>
              {t("settings.deleteMemoryDescription")}
            </p>
            <CleanReduxStore />
          </div>
        </SettingsSection>
      </div>
    </>
  );
};
