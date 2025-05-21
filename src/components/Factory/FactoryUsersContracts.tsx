//import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/utils/hooks";
import { ActiveView, Address } from "@src/types/common";
import { UserContracts } from "./UserContracts";

interface FactoryUsersContractsProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

interface Contract {
  address: Address;
  title: string;
  originalIndex: number;
}

export const FactoryUsersContracts: React.FC<FactoryUsersContractsProps> = ({
  setActiveView,
}) => {
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

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
        {users?.map((user, userIndex) => {
          const userTitles: Contract[] = userContracts[user]?.map(
            (contractAddr: Address, index: number) => ({
              address: contractAddr,
              title: contractsTitles[contractAddr] || "",
              originalIndex: index,
            })
          );
          return (
            <div key={"user-" + userIndex}>
              <UserContracts
                setActiveView={setActiveView}
                userAddr={user}
                userTitles={userTitles}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
