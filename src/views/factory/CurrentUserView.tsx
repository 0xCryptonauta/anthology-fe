import { UserContracts } from "@components/Factory/UserContracts";
import { ContractsSyncMessage } from "@components/Factory/ContractsSyncMessage";
import { useAppSelector } from "@src/store/utils/hooks";
import { useSyncUserContracts } from "@src/hooks/useSyncUserContracts";
import { Address } from "@src/types/common";
import { useTranslation } from "@src/i18n/useTranslation";

interface Contract {
  address: Address;
  title: string;
  originalIndex: number;
}

export const CurrentUserView = () => {
  const { t } = useTranslation();
  const { userContracts, contractsTitles, whitelistedUsers } = useAppSelector(
    (state) => state.factory
  );

  const { userAddr } = useAppSelector((state) => state.user);
  const { status, reload } = useSyncUserContracts(userAddr);

  const userTitles: Contract[] = (userContracts[userAddr] ?? []).map(
    (contractAddr: Address, index: number) => ({
      address: contractAddr,
      title: contractsTitles[contractAddr] || "",
      originalIndex: index,
    })
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          padding: "8px",
        }}
      >
        <ContractsSyncMessage
          status={status}
          empty={userTitles.length === 0}
          reload={reload}
        />
        {!whitelistedUsers.includes(userAddr) && (
          <span style={{ color: "Red" }}>{t("discover.notWhitelisted")}</span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-around",
          flexWrap: "wrap",
          width: "100%",
          minWidth: 0,
        }}
      >
        <UserContracts userAddr={userAddr} userTitles={userTitles} />
      </div>
    </div>
  );
};
