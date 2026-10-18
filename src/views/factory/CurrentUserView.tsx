import { UserContracts } from "@components/Factory/UserContracts";
import { useAppSelector } from "@src/store/utils/hooks";
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

  const userTitles: Contract[] = userContracts[userAddr]?.map(
    (contractAddr: Address, index: number) => ({
      address: contractAddr,
      title: contractsTitles[contractAddr] || "",
      originalIndex: index,
    })
  );

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <UserContracts userAddr={userAddr} userTitles={userTitles} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {!userTitles?.[0] && <span>{t("discover.notFound")}</span>}
        {!whitelistedUsers.includes(userAddr) && (
          <span style={{ color: "Red" }}>{t("discover.notWhitelisted")}</span>
        )}
      </div>
    </div>
  );
};
