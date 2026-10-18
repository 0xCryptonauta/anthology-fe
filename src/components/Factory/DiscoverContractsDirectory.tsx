import { useAppSelector } from "@store/utils/hooks";
import { Address } from "@src/types/common";
import { UserContracts } from "./UserContracts";
import { useAccount } from "wagmi";
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

  const { address: currentUser } = useAccount();

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
        {users.length === 0 && (
          <span>{t("discover.noAnthologies")}</span>
        )}
        {users
          ?.filter((user) => user !== currentUser)
          .map((user, userIndex) => {
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
