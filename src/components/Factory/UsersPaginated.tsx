import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../functions/copyToClipboard";
import { shortenAddress } from "../../functions/shortenAddress";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export const UsersPaginated = () => {
  const navigate = useNavigate();
  const { userCount, users, userContracts, contractsTitles } = useSelector(
    (state: RootState) => state.factory
  );

  const pageSize = 50;
  const page = 1;

  //- useSelector is rerendering beacuse its fetching data in the backgo

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid white",
        width: "350px",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <h3>Total users: {userCount?.toString()}</h3>
      <span>
        Page: {page} Page size: {pageSize}
      </span>
      <span>Users paginated: {users?.length}</span>
      <br />
      <div style={{ margin: "5px" }}>
        {users?.map((user, index) => {
          //console.log("userContracts[user]", userContracts[user]);
          return (
            <div key={index}>
              <div>
                <span
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => navigate("/" + user)}
                >
                  👤 {shortenAddress(user, 12, 9)}
                </span>
                <div style={{ marginLeft: "30px" }}>
                  {userContracts[user]?.map((contractAddr, index) => {
                    const contractTitle = contractsTitles[contractAddr];

                    return (
                      <div key={index}>
                        <span>💾 </span>
                        <span
                          style={{ fontSize: "14px", cursor: "pointer" }}
                          onClick={() => navigate("/" + user + "/" + index)}
                        >
                          {contractTitle
                            ? contractTitle
                            : shortenAddress(contractAddr, 10, 8)}
                        </span>
                        <span
                          style={{ marginLeft: "5px", cursor: "pointer" }}
                          onClick={() => copyToClipboard(contractAddr)}
                        >
                          🔗
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};
