import { useState } from "react";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { Address, SkinType } from "@src/types/common";
import { toBytes8Hex } from "@src/utils/toBytes8Hex";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "../Layout/Toast";
import { SkinSelector } from "../Layout/SkinSelector";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { setDefaultSkin } from "@src/store/slices/localAnthologySlice";

export const ChangeAnthologyDefaultSkin = ({
  contractAddr,
}: {
  contractAddr: Address;
}) => {
  const isLocal = isLocalAnthology(contractAddr);
  const { addToast } = useToast();

  const anthologyState = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr]?.anthologyState : undefined
  );

  const localDefaultSkin = useAppSelector((state) =>
    contractAddr ? state.localAnthology.defaultSkin[contractAddr] : undefined
  ) as SkinType;

  const dispatch = useAppDispatch();

  const [newDefaultSkin, setNewDefaultSkin] = useState(
    isLocal ? localDefaultSkin : (anthologyState?.skin as SkinType)
  );

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "20px" }}>
      <div style={{ marginRight: "15px" }}>Default Skin: </div>
      <div>
        <SkinSelector
          value={newDefaultSkin}
          onChange={(newSkin) => {
            setNewDefaultSkin(newSkin);
          }}
        />
      </div>
      <button
        style={{ backgroundColor: "dodgerblue" }}
        onClick={async () => {
          try {
            if (isLocal) {
              dispatch(
                setDefaultSkin({
                  contract: contractAddr,
                  newDefaultSkin: newDefaultSkin,
                })
              );
              addToast({
                title: "Default skin changed to",
                content: newDefaultSkin,
                variant: "success",
                delay: 3000,
              });
            } else {
              const encodedBytes8 = toBytes8Hex(newDefaultSkin);

              const txHash = await writeAnthology(contractAddr, "setSkin", [
                encodedBytes8,
              ]);
              if (txHash) {
                addToast({
                  title: "Default skin changed to",
                  content: newDefaultSkin + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 3000,
                });
              }
            }
          } catch (error) {
            addToast({
              title: "Error setting new default skin",
              content: "Unknown error",
              variant: "warning",
              delay: 3000,
            });
            console.error("Error setting new new default skin", error);
          }
        }}
      >
        Change
      </button>
    </div>
  );
};
