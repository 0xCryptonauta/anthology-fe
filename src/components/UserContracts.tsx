import { copyToClipboard } from "../functions/copyToClipboard";
import { shortenAddress } from "../functions/shortenAddress";
import { RootState } from "../store";
import { useSelector } from "react-redux";

export const UserContracts = () => {
  const { userContracts, contractsTitles } = useSelector(
    (state: RootState) => state.factory
  );
  const { userAddr } = useSelector((state: RootState) => state.user);

  console.log("contractTitles:", contractsTitles);
  console.log("userContracts:", userContracts);

  const pageSize = 50;
  const page = 1;

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
      <h3>My Anthologies</h3>
      <span>
        Total: {page} Page size: {pageSize}
      </span>
      <br />
      <div style={{ margin: "5px" }}>
        {userContracts[userAddr]?.map((contractAddr) => {
          const contractTitle = contractsTitles[contractAddr];

          return (
            <div>
              <span>💾 </span>
              <span style={{ fontSize: "14px" }}>
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
  );
};
