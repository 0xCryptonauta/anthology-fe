import { useEffect, useState } from "react";
import { readFactory } from "./FactoryFunctions";

export const WhitelistedUsers = () => {
  const [whitelistedUsers, setWhitelistedUsers] = useState([]);

  useEffect(() => {
    const fetchWhitelistedUsers = async () => {
      const whitelistedUsers = await readFactory("getWhitelistedUsers");
      setWhitelistedUsers(whitelistedUsers as []);
      console.log("WhitelistedUsers:", whitelistedUsers);
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
      <h3>Whitelisted addresses: {whitelistedUsers.length}</h3>
      <div>
        {whitelistedUsers.map((user, key) => {
          return <span key={key}>{user}</span>;
        })}
      </div>
    </div>
  );
};
