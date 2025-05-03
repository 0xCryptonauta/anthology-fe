import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUserAddr, updateWalletId } from "@store/slices/userSlice";
import { reconnectWallet } from "@utils/initialStateUpdate";

export const useReconnectWallet = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const currentUser = await reconnectWallet();
        dispatch(updateUserAddr(currentUser?.currentAddr as string));
        dispatch(updateWalletId(currentUser?.walletId as string));
      } catch (error) {
        console.error("Wallet reconnection failed:", error);
      }
    };

    fetchWallet();
  }, [dispatch]);
};
