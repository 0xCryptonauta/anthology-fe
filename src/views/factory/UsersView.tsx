import { DeployButton } from "../../components/DeployButton";
import { MainComponent } from "../../components/Factory/MainComponent";

import { useEffect } from "react";
import {
  fetchContractData,
  reconnectWallet,
} from "../../functions/initialStateUpdate";
import { useDispatch, useSelector } from "react-redux";
import {
  updateContractTitles,
  updateFactoryBasicInfo,
  updateUserContracts,
  updateUserCount,
  updateUsers,
  updateWhitelistedUsers,
} from "../../slices/factorySlice";
import { readFactory } from "../../components/ContractFunctions/FactoryFunctions";
import { updateUserAddr, updateWalletId } from "../../slices/userSlice";
import { transformData } from "../../functions/transformData";
import { RootState } from "../../store";

export const UsersView = () => {
  const dispatch = useDispatch();

  const { userCount } = useSelector((state: RootState) => state.factory);

  console.log("userCount:", userCount);

  useEffect(() => {
    console.log("useEffect RootView.");
    const setupFactory = async () => {
      // Recconect wallet if previously connected
      const currentUser = await reconnectWallet();
      dispatch(updateUserAddr(currentUser?.currentAddr as string));
      dispatch(updateWalletId(currentUser?.walletId as string));

      let cp;

      if (userCount) {
        cp = await readFactory("userCount");
        dispatch(updateUserCount(Number(cp)));
      } else {
        // Fetch basic factory info
        const contractInfo = await fetchContractData();
        dispatch(updateFactoryBasicInfo(contractInfo));

        // If whitelist is enabled, fetch whitelisted addresses
        if (contractInfo.whitelistEnabled) {
          const whitelistedUsers = await readFactory("getWhitelistedUsers");
          dispatch(updateWhitelistedUsers(whitelistedUsers as string[]));
        }
      }

      if (Number(cp) != userCount) {
        // Fetch all registered users
        const users = await readFactory("getUsers");
        dispatch(updateUsers(users as []));

        // Get the contracts addresses (anthologies) and its titles           <<<<------ Move this to other place
        const userDB = await readFactory("getUsersContractsWithTitles", [
          users,
        ]);
        // Is this function resource intensive?
        const { userContracts, titles } = transformData(
          userDB as string[][][],
          users as string[]
        );

        dispatch(updateContractTitles(titles));
        dispatch(updateUserContracts(userContracts));
        console.log("Dispatching data to store...");
      }
    };

    setupFactory();
  }, [dispatch]);
  return (
    <div
      className="bg-dark"
      style={{
        color: "white",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <DeployButton />
      </div>
      <MainComponent />
    </div>
  );
};
