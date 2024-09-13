import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import {
  fetchContractData,
  reconnectWallet,
} from "../functions/initialStateUpdate";
import { useDispatch } from "react-redux";
import {
  updateContractTitles,
  updateFactoryBasicInfo,
  updateUserContracts,
  updateUsers,
  updateWhitelistedUsers,
} from "../slices/factorySlice";
import { readFactory } from "../components/ContractFunctions/FactoryFunctions";
import { updateUserAddr, updateWalletId } from "../slices/userSlice";
import { transformData } from "../functions/transformData";

export const RootView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("useEffect RootView.");
    const startClient = async () => {
      const data = await fetchContractData();
      dispatch(updateFactoryBasicInfo(data));

      const whitelistedUsers = await readFactory("getWhitelistedUsers");
      dispatch(updateWhitelistedUsers(whitelistedUsers as string[]));

      const users = await readFactory("getUsers");
      dispatch(updateUsers(users as []));

      const currentUser = await reconnectWallet();
      dispatch(updateUserAddr(currentUser?.currentAddr as string));
      dispatch(updateWalletId(currentUser?.walletId as string));

      const userDB = await readFactory("getUsersContractsWithTitles", [users]);
      // This function might be resource intensive?
      const { userContracts, titles } = transformData(
        userDB as string[][][],
        users as string[]
      );

      dispatch(updateContractTitles(titles));
      dispatch(updateUserContracts(userContracts));
      console.log("Dispatching data to store...");
    };

    startClient();
  }, [dispatch]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <div
        className="bg-dark"
        style={{ minHeight: "calc(100svh - 60px)", color: "white" }} // -64 of the Header height
      >
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
