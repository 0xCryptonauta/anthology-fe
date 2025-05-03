import { UsersPaginated } from "@src/components/Factory/UsersPaginated";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { syncUsersContractsToStore } from "@src/store/utils/thunks";

//import { GetUserContracts } from "./GetUserContracts";
import { ActiveView } from "@src/types/common";

interface FactoryViewProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const FactoryView: React.FC<FactoryViewProps> = ({ setActiveView }) => {
  const { users } = useAppSelector((state) => state.factory);

  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      {/* <GetUserContracts /> */}
      {users && (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => dispatch(syncUsersContractsToStore(users))}
        >
          {" "}
          🔄
        </span>
      )}
      {users ? (
        <UsersPaginated setActiveView={setActiveView} />
      ) : (
        <div> Loading users </div>
      )}
    </div>
  );
};
