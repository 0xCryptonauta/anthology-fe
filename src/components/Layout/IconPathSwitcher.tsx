import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "./Toast";
import { toggleIsIconToLocal } from "@src/store/slices/dappSlice";
import { useAccount } from "wagmi";

export const IconPathSwitcher = () => {
  const { isIconToLocal } = useAppSelector((state) => state.dapp);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const { isConnected } = useAccount();

  return (
    isConnected && (
      <div
        style={{
          border: "1px white solid",
          padding: "10px",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0px 15px 0px",
        }}
      >
        <h4>Icon should lead to:</h4>
        <br />
        <div>
          <input
            type="checkbox"
            checked={isIconToLocal}
            onChange={() => {
              if (!isIconToLocal) {
                dispatch(toggleIsIconToLocal());
                addToast({
                  title: "Icon path changed",
                  content: "Now poiting to local anthologies",
                  variant: "success",
                  delay: 3000,
                });
              }
            }}
          ></input>
          <span style={{ marginLeft: "7px" }}>Local User Anthologies</span>
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={!isIconToLocal}
            onChange={() => {
              if (isIconToLocal) {
                dispatch(toggleIsIconToLocal());

                addToast({
                  title: "Icon path changed",
                  content: "Now poiting to on-chain anthologies",
                  variant: "success",
                  delay: 3000,
                });
              }
            }}
          ></input>
          <span style={{ marginLeft: "7px" }}>Web3 Anthologies</span>
        </div>
      </div>
    )
  );
};
