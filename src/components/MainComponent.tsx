import { UsersPaginated } from "./UsersPaginated";
import { GetUserContracts } from "./GetUserContracts";

export const MainComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <span>THIS IS THE CORE</span>
      <UsersPaginated />
      <GetUserContracts />
    </div>
  );
};
