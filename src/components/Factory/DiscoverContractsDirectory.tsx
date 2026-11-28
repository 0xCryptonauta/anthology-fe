import { useAppSelector } from "@store/utils/hooks";
import { Address } from "@src/types/common";
import { UserContracts } from "./UserContracts";
import { useConnection } from "wagmi";
import { useTranslation } from "@src/i18n/useTranslation";

interface Contract {
  address: Address;
  title: string;
  originalIndex: number;
}

export const DiscoverContractsDirectory = () => {
  const { t } = useTranslation();
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const { address: currentUser } = useConnection();
  const visibleUsers = users.filter((user) => user !== currentUser);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <div style={{ margin: "5px" }}>
        {visibleUsers.length === 0 && (
          <span role="status">{t("discover.noAnthologies")}</span>
        )}
        {visibleUsers.map((user, userIndex) => {
            const userTitles: Contract[] = userContracts[user]?.map(
              (contractAddr: Address, index: number) => ({
                address: contractAddr,
                title: contractsTitles[contractAddr] || "",
                originalIndex: index,
              })
            );
            return (
              <div key={"user-" + userIndex}>
                <UserContracts userAddr={user} userTitles={userTitles} />
              </div>
            );
          })}
      </div>
    </div>
  );
};
