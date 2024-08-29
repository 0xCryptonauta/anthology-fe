import { useEffect, useState } from "react";
import { readFactory } from "./FactoryFunctions";

// Users can not grow much (10K or more) due to fetching and modifying the array
// Can be changed to be the selected users* or something in those lines
export const UsersPaginated = () => {
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [usersCount, setUsersCount] = useState<bigint>(0n);

  const pageSize = 10;
  const page = 1;

  const fetchUsersPaginated = async () => {
    const _Users = await readFactory("getUsers", [page, pageSize]);
    setPaginatedUsers(_Users as []);

    console.log("Users paginated:", _Users);
  };

  useEffect(() => {
    const fetchUsersCount = async () => {
      const _usersCount = await readFactory("getUserCount");
      setUsersCount(_usersCount as bigint);

      console.log("userCount:", _usersCount);
    };

    fetchUsersCount();

    if (usersCount > 0) fetchUsersPaginated();
  }, [usersCount]);

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
      <h3>Total users: {usersCount.toString()}</h3>
      <span>
        Page: {page} Page size: {pageSize}
      </span>
      <span>Users paginated: {paginatedUsers.length}</span>
      <br />
      <div>
        {paginatedUsers.map((user, key) => {
          return <div key={key}>{user}</div>;
        })}
      </div>
    </div>
  );
};
