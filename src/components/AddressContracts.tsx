import { Navigate, useNavigate, useParams } from "react-router-dom";
import { copyToClipboard } from "../functions/copyToClipboard";
import { shortenAddress } from "../functions/shortenAddress";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const addressEnsregex =
  /^(0x[a-fA-F0-9]{40})|([a-zA-Z0-9.-]+\.eth([.][a-zA-Z0-9-]+)*)$/;

const ethAddrRegex = /^0x[a-fA-F0-9]{40}$/;

export const AddressContracts = () => {
  const navigate = useNavigate();
  const { userContracts, contractsTitles } = useSelector(
    (state: RootState) => state.factory
  );

  /*   const pageSize = 50;
  const page = 1; */

  const { ethAddr } = useParams();

  if (ethAddr && addressEnsregex.test(ethAddr)) {
    if (ethAddrRegex.test(ethAddr)) {
      console.log("Call wagmi to get ens", ethAddr);
      const userAddrSeg = ethAddr.split(".");
      console.log("segmented:", userAddrSeg);
    } else {
      console.log("Call wagmi to get Addr", ethAddr);
      const userAddrSeg = ethAddr.split(".");
      console.log("segmented:", userAddrSeg);
    }
    // Validate the Ethereum address
  } else {
    console.log("Trying to reach: ", ethAddr);
    return <Navigate to="/not-found" />;
  }

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
      <h4>{ethAddr}</h4>

      {/*       <span>
        Total: {page} Page size: {pageSize}
      </span> */}
      <br />
      <div style={{ margin: "5px" }}>
        {userContracts[ethAddr] ? (
          userContracts[ethAddr]?.map((contractAddr, index) => {
            const contractTitle = contractsTitles[contractAddr];

            return (
              <div key={index}>
                <span>💾 </span>
                <span
                  style={{ fontSize: "14px", cursor: "pointer" }}
                  onClick={() => navigate("/user/" + ethAddr + "/" + index)}
                >
                  {contractTitle
                    ? contractTitle
                    : shortenAddress(contractAddr || "", 10, 8)}
                </span>
                <span
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  onClick={() => copyToClipboard(contractAddr)}
                >
                  🔗
                </span>
              </div>
            );
          })
        ) : (
          <div>User not found</div>
        )}
      </div>
    </div>
  );
};
