import { DeployButton } from "../../components/DeployButton";
import { UserContracts } from "../../components/UserContracts";

export const AccountView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        //width: "100%",
        height: "100svh",
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <UserContracts />
      <DeployButton />
    </div>
  );
};
