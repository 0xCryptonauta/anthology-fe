import { DeployButton } from "@components/Factory/DeployButton";
import { UserContracts } from "@components/Factory/UserContracts";

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
