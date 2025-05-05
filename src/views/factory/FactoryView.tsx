import { UsersPaginated } from "@src/components/Factory/UsersPaginated";
import { useAppSelector } from "@src/store/utils/hooks";

//import { GetUserContracts } from "./GetUserContracts";
import { ActiveView } from "@src/types/common";

interface FactoryViewProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const FactoryView: React.FC<FactoryViewProps> = ({ setActiveView }) => {
  const { users } = useAppSelector((state) => state.factory);

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
      {users ? (
        <UsersPaginated setActiveView={setActiveView} />
      ) : (
        <div> Loading users </div>
      )}
    </div>
  );
};
