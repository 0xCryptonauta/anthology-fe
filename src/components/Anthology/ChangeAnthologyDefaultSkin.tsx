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
  embedded = false,
}: {
  contractAddr: Address;
  /** Renders just the selector + action for a SettingsRow. */
  embedded?: boolean;
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
  const [saving, setSaving] = useState(false);

  const applySkin = async (skin: SkinType) => {
    if (!skin) return;

    try {
      if (isLocal) {
        dispatch(
          setDefaultSkin({
            contract: contractAddr,
            newDefaultSkin: skin,
          })
        );
        addToast({
          title: t("skin.changedTitle"),
          content: skin,
          variant: "success",
          delay: 3000,
        });
        return;
      }

      setSaving(true);
      const encodedBytes8 = toBytes8Hex(skin);
      const txHash = await writeAnthology(contractAddr, "setSkin", [
        encodedBytes8,
      ]);
      if (txHash) {
        addToast({
          title: t("skin.changedTitle"),
          content: skin + "\n\nTxHash: " + txHash,
          variant: "success",
          delay: 3000,
        });
      }
    } catch (error) {
      addToast({
        title: t("skin.errorChanged"),
        content: t("common.unknownError"),
        variant: "warning",
        delay: 3000,
      });
      console.error("Error setting new new default skin", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkinChange = (skin: SkinType) => {
    setNewDefaultSkin(skin);
    // In the anthology panel the selection is the action: no separate
    // Change button, and on-chain writes disable the selector while pending.
    if (embedded) void applySkin(skin);
  };

  return (
    <div
      /* Mobile-first: the label gets its own line so the selector + button row
         never widens the page on small screens. */
      style={{
        display: "flex",
        flexDirection: embedded ? "row" : "column",
        alignItems: "center",
        justifyContent: embedded ? "flex-end" : "center",
        gap: "8px",
        margin: embedded ? 0 : "12px 0",
        width: "100%",
        boxSizing: "border-box",
        flexWrap: "wrap",
      }}
    >
      {!embedded && <span style={{ fontWeight: 500 }}>{t("skin.default")}</span>}

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
          onChange={handleSkinChange}
          disabled={saving}
        />
        {!embedded && (
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
            onClick={() => void applySkin(newDefaultSkin)}
          >
            {t("common.change")}
          </button>
        )}
      </div>
    </div>
  );
};
