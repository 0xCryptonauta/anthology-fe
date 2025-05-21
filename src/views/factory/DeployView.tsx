import { DeployButton } from "@components/Factory/DeployButton";

export const DeployView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        //width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <DeployButton />
    </div>
  );
};
