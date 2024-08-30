import { RootState } from "../store";
import { useSelector } from "react-redux";

export const Users = () => {
  const { users } = useSelector((state: RootState) => state.factory);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <h3>Users: {users.length}</h3>
      <div>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
