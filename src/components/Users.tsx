import { useEffect, useState } from "react";
import { readFactory } from "./FactoryFunctions";

// Users can not grow much (10K or more) due to fetching and modifying the array
// Can be changed to be the selected users* or something in those lines
export const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchWhitelistedUsers = async () => {
      const Users = await readFactory("getUsers");
      setUsers(Users as []);
      console.log("WhitelistedUsers:", Users);
    };

    fetchWhitelistedUsers();
  }, []);

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
        {users.map((user, key) => {
          return <div key={key}>{user}</div>;
        })}
      </div>
    </div>
  );
};
