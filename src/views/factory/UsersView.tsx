import { DeployButton } from "@components/Factory/DeployButton";
import { MainComponent } from "@components/Factory/MainComponent";

import { useEffect } from "react";
import { fetchContractData } from "@utils/initialStateUpdate";
import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
import {
  updateContractTitles,
  updateFactoryBasicInfo,
  updateUserContracts,
  updateUsers,
  updateUsersCP,
  updateWhitelistedUsers,
} from "@store/slices/factorySlice";
import { readFactory } from "@contract-functions/FactoryFunctions";
import { transformData } from "@utils/transformData";

export const UsersView = () => {
  const dispatch = useAppDispatch();

  const { usersCP } = useAppSelector((state) => state.factory);

  useEffect(() => {
    //console.log("useEffect FactoryView.");
    const setupFactory = async () => {
      let CP = 0;

      if (usersCP) {
        CP = Number(await readFactory("usersCP"));
        dispatch(updateUsersCP(CP));
      } else {
        // Fetch basic factory info
        const contractInfo = await fetchContractData();
        dispatch(updateFactoryBasicInfo(contractInfo));
        CP = contractInfo.usersCP;

        // If whitelist is enabled, fetch whitelisted addresses
        if (contractInfo.whitelistEnabled) {
          const whitelistedUsers = await readFactory("getWhitelistedUsers");
          dispatch(updateWhitelistedUsers(whitelistedUsers as string[]));
        }
      }

      if (CP !== usersCP) {
        // How would i fetch for deleted users?
        // Add pagination at 15 -30 addresses (?)

        // Fetch all registered users
        const users = await readFactory("getUsers", [usersCP, CP]);
        console.log("USERS:", users);
        dispatch(updateUsers(users as []));

        // Get the contracts addresses (anthologies) and its titles           <<<<vvv------ Move this to other place
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
        //height: "100svh",
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
