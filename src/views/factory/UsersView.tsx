import { DeployButton } from "../../components/DeployButton";
import { MainComponent } from "../../components/MainComponent";

export const UsersView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <DeployButton />
      </div>
      <MainComponent />
    </div>
  );
};
