import { RootState } from "../store";
import { useSelector } from "react-redux";

export const UsersPaginated = () => {
  const { userCount, users } = useSelector((state: RootState) => state.factory);

  const pageSize = 50;
  const page = 1;

  /*   const fetchUsersPaginated = async () => {
    const _Users = await readFactory("getUsers", [page, pageSize]);
    setPaginatedUsers(_Users as []);

    console.log("Users paginated:", _Users);
  };

  useEffect(() => {

    if (userCount > 0) fetchUsersPaginated();
  }, []); */

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
      <h3>Total users: {userCount.toString()}</h3>
      <span>
        Page: {page} Page size: {pageSize}
      </span>
      <span>Users paginated: {users.length}</span>
      <br />
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
