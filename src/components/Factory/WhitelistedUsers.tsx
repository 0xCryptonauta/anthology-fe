import { useSelector } from "react-redux";
import { RootState } from "../../store";

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
        {whitelistedUsers.map((address, index) => (
          <div key={index}>
            <span style={{ fontSize: "14px" }}>{address}</span>
          </div>
        ))}
      </div>
    </div>
  );
};