import { MainComponent } from "../components/MainComponent";

export const UsersView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <MainComponent />
    </div>
  );
};
