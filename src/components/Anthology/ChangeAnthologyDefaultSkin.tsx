import { useState } from "react";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { Address, SkinType } from "@src/types/common";
import { toBytes8Hex } from "@src/utils/toBytes8Hex";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { useToast } from "../Layout/Toast";
import { SkinSelector } from "../Layout/SkinSelector";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { setDefaultSkin } from "@src/store/slices/localAnthologySlice";
import { useTranslation } from "@src/i18n/useTranslation";

export const ChangeAnthologyDefaultSkin = ({
  contractAddr,
}: {
  contractAddr: Address;
}) => {
  const { t } = useTranslation();
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
    <div
      /* Mobile-first: the label gets its own line so the selector + button row
         never widens the page on small screens. */
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        margin: "12px 0",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontWeight: 500 }}>{t("skin.default")}</span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <SkinSelector
          value={newDefaultSkin}
          onChange={(newSkin) => {
            setNewDefaultSkin(newSkin);
          }}
        />
        <button
          type="button"
          style={{
            backgroundColor: "dodgerblue",
            color: "white",
            border: "none",
            height: "36px",
            padding: "0 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
          }}
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
                  title: t("skin.changedTitle"),
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
                    title: t("skin.changedTitle"),
                    content: newDefaultSkin + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 3000,
                  });
                }
              }
            } catch (error) {
              addToast({
                title: t("skin.errorChanged"),
                content: t("common.unknownError"),
                variant: "warning",
                delay: 3000,
              });
              console.error("Error setting new new default skin", error);
            }
          }}
        >
          {t("common.change")}
        </button>
      </div>
    </div>
  );
};
