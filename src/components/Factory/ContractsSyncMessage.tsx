import type { ContractsSyncStatus } from "@src/hooks/useSyncUserContracts";
import { useTranslation } from "@src/i18n/useTranslation";

interface ContractsSyncMessageProps {
  status: ContractsSyncStatus;
  empty: boolean;
  reload: () => void;
}

export const ContractsSyncMessage = ({
  status,
  empty,
  reload,
}: ContractsSyncMessageProps) => {
  const { t } = useTranslation();

  if (status === "loading") {
    return <span role="status">{t("common.loading")}</span>;
  }

  if (status === "error") {
    return (
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
          onClick={reload}
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
    );
  }

  if (status === "success" && empty) {
    return <span role="status">{t("discover.notFound")}</span>;
  }

  return null;
};
