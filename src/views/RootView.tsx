import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUserAddr, updateWalletId } from "../slices/userSlice";
import { reconnectWallet } from "../functions/initialStateUpdate";

export const RootView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("RootView - Reconnect");
    const fetchWallet = async () => {
      const currentUser = await reconnectWallet();
      dispatch(updateUserAddr(currentUser?.currentAddr as string));
      dispatch(updateWalletId(currentUser?.walletId as string));
    };
    fetchWallet();
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
