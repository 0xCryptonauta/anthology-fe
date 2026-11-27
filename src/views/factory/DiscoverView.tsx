import { DiscoverContractsDirectory } from "@src/components/Factory/DiscoverContractsDirectory";
import { AddToDiscover } from "@src/components/Layout/AddToDiscover";
import { useGetFactoryUsers } from "@src/hooks/useGetFactoryUsers";
import { useSyncDiscoveredContracts } from "@src/hooks/useSyncDiscoveredContracts";
import { useTranslation } from "@src/i18n/useTranslation";

export const DiscoverView = () => {
  const { t } = useTranslation();
  const { status: usersStatus, reload: reloadUsers } = useGetFactoryUsers();
  const { status: contractsStatus, reload: reloadContracts } =
    useSyncDiscoveredContracts(usersStatus === "success");

  const loading =
    usersStatus === "idle" ||
    usersStatus === "loading" ||
    contractsStatus === "idle" ||
    contractsStatus === "loading";
  const failed = usersStatus === "error" || contractsStatus === "error";

  const retry = () => {
    reloadUsers();
    reloadContracts();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <AddToDiscover />

      {loading && !failed && <span role="status">{t("common.loading")}</span>}

      {failed && (
        <div
          role="alert"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "#fecaca",
            textAlign: "center",
          }}
        >
          <span>{t("discover.loadFailed")}</span>
          <span>{t("discover.loadFailedDesc")}</span>
          <button
            type="button"
            onClick={retry}
            style={{
              minHeight: "44px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #fecaca",
              background: "transparent",
              color: "white",
              cursor: "pointer",
            }}
          >
            {t("common.retry")}
          </button>
        </div>
      )}

      {!loading && !failed && <DiscoverContractsDirectory />}
    </div>
  );
};
