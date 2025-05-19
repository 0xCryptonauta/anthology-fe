import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "./Toast";
import { toggleShouldAddToBlockchain } from "@src/store/slices/dappSlice";
import { useAccount } from "wagmi";

export const ShouldAddToBlockchain = () => {
  const { shouldAddToBlockchain } = useAppSelector((state) => state.dapp);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const { isConnected } = useAccount();

  if (!isConnected && shouldAddToBlockchain) {
    dispatch(toggleShouldAddToBlockchain());
  }

  return (
    isConnected && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0px 15px 0px",
        }}
      >
        <input
          type="checkbox"
          checked={shouldAddToBlockchain}
          onChange={(e) => {
            dispatch(toggleShouldAddToBlockchain());
            if (e.target.checked) {
              addToast({
                title: "Posting to blockchain enabled",
                content: "Each submition will need signature from wallet",
                variant: "success",
                delay: 5000,
              });
            } else {
              addToast({
                title: "Posting to blockchain disabled",
                content:
                  "All submitions to anthologies will be added locally, later to be posted to blockchain",
                variant: "info",
                delay: 7000,
              });
            }
          }}
        ></input>
        <span style={{ marginLeft: "7px" }}> Post to Blockchain</span>
      </div>
    )
  );
};
