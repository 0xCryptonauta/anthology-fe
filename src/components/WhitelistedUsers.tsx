import { useSelector } from "react-redux";
import { RootState } from "../store";

export const WhitelistedUsers = () => {
  const { whitelistedUsers } = useSelector((state: RootState) => state.factory);

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
        <ul>
          {whitelistedUsers.map((address, index) => (
            <li key={index}>{address}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
