import { UserContracts } from "@components/Factory/UserContracts";
import { ActiveView } from "@src/types/common";
interface AccountViewProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ setActiveView }) => {
  return (
    <div
      className="bg-dark"
      style={{
        //width: "100%",
        height: "100svh",
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <UserContracts setActiveView={setActiveView} />
    </div>
  );
};
