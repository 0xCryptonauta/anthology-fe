import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../functions/copyToClipboard";
import { shortenAddress } from "../../functions/shortenAddress";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export const UserContracts = () => {
  const navigate = useNavigate();
  const { userContracts, contractsTitles } = useSelector(
    (state: RootState) => state.factory
  );
  const { userAddr } = useSelector((state: RootState) => state.user);

  /* const pageSize = 50;
  const page = 1; */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //border: "1px solid white",
        width: "100%",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      {/*       <h3>
        {" "}
        {ethAddr?.length > 20 ? shortenAddress(ethAddr, 10, 8) : ethAddr}:
        <span>Anthologies from:</span>
      </h3> */}
      <h4>{shortenAddress(userAddr, 10, 8)}</h4>

      {/*       <span>
        Total: {page} Page size: {pageSize}
      </span> */}
      <br />
      <div style={{ margin: "5px" }}>
        {userContracts[userAddr]?.map((contractAddr, index) => {
          const contractTitle = contractsTitles[contractAddr];

          return (
            <div key={index}>
              <span>💾 </span>
              <span
                style={{ fontSize: "14px", cursor: "pointer" }}
                onClick={() => navigate("/" + userAddr + "/" + index)}
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
  );
};
