import { copyToClipboard } from "@utils/copyToClipboard";
import { shortenAddress } from "@utils/shortenAddress";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
import { ActiveView } from "@src/types/common";
interface UserContractsProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const UserContracts: React.FC<UserContractsProps> = ({
  setActiveView,
}) => {
  const dispatch = useAppDispatch();
  const { userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );
  const { userAddr } = useAppSelector((state) => state.user);

  const handleOnClick = (newActiveView: ActiveView) => {
    setActiveView(newActiveView); // Update local state

    // Push new history entry without changing URL
    window.history.pushState(
      { activeView: newActiveView }, // Store component name in history.state
      "", // Unused title
      window.location.pathname // Keep URL as `/`
    );
  };

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
      <div>
        <span
          style={{ cursor: "pointer", margin: "0px 10px" }}
          onClick={() => dispatch(syncUserContractsToStore(userAddr))}
        >
          🔄
        </span>
        <span>{shortenAddress(userAddr, 10, 8)}</span>
      </div>

      <br />
      <div style={{ margin: "5px" }}>
        {userContracts[userAddr]?.map((contractAddr, index) => {
          const contractTitle = contractsTitles[contractAddr];

          return (
            <div key={index}>
              <span>💾 </span>
              <span
                style={{ fontSize: "14px", cursor: "pointer" }}
                onClick={() => {
                  handleOnClick(`contract/${contractAddr}`);
                }}
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
