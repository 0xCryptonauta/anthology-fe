import { Card } from "../Layout/Card";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";

import "./style.css";
import { Address, CurrentPaths, SkinType } from "@src/types/common";
import {
  CHAIN_SCAN_URL,
  DEFAULT_SKIN,
  LOCAL_USER_ADDR,
} from "@src/utils/constants";
import { QRCodeGenerator } from "../Layout/QRCodeGenerator";
import { copyToClipboard } from "@src/utils/copyToClipboard";
import { useToast } from "../Layout/Toast";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";
import {
  addManyMemoirsToUserLocalAnthology,
  addUserLocalAnthology,
  setDefaultSkin,
} from "@src/store/slices/localAnthologySlice";
import { removePadding } from "@src/utils/removePadding";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useTranslation } from "@src/i18n/useTranslation";

interface AnthologyStateProps {
  contractAddr: Address;
}

export const AnthologyState: React.FC<AnthologyStateProps> = ({
  contractAddr,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const anthologyData = useAppSelector((state) => {
    try {
      return state.anthology[contractAddr] || null;
    } catch (error) {
      console.error("error in anthologyState", error);
      return null;
    }
  });

  const anthologyState = anthologyData?.anthologyState;
  const memoirs = anthologyData?.memoirs || [];

  const shareUrl = `${window.location.origin}/?contract=${contractAddr}`;

  const handleCopyShareLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      addToast({
        title: t("anthologyState.linkCopied"),
        content: t("anthologyState.linkCopiedDesc"),
        variant: "success",
        delay: 3000,
      });
    }
  };

  const handleCloneToLocal = () => {
    const newLocalAddr = generateLocalContractAddr();
    const title =
      anthologyState?.title || t("anthologyState.clonedFallback");
    const cleanedSkin = anthologyState?.skin
      ? (removePadding(anthologyState.skin) as SkinType)
      : DEFAULT_SKIN;

    dispatch(
      addUserLocalAnthology({
        user: LOCAL_USER_ADDR,
        contract: newLocalAddr,
        title,
      })
    );

    if (memoirs.length > 0) {
      dispatch(
        addManyMemoirsToUserLocalAnthology({
          contract: newLocalAddr,
          memoirs: memoirs.map((m) => ({
            sender: LOCAL_USER_ADDR,
            title: m.title,
            content: m.content,
            timestamp: String(m.timestamp),
          })),
        })
      );
    }

    dispatch(
      setDefaultSkin({
        contract: newLocalAddr,
        newDefaultSkin: cleanedSkin || DEFAULT_SKIN,
      })
    );

    const newPath = `contract/${newLocalAddr}` as CurrentPaths;
    dispatch(updateCurrentPath(newPath));
    window.history.pushState(
      { currentPath: newPath },
      "",
      window.location.pathname
    );

    addToast({
      title: t("anthologyState.clonedTitle"),
      content: t("anthologyState.clonedDesc", {
        title,
        count: memoirs.length,
      }),
      variant: "success",
      delay: 4000,
    });
  };

  return (
    <div
      style={{
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        maxWidth: "380px",
        boxSizing: "border-box",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Card
        title={t("anthologyState.address")}
        content={contractAddr}
        contentHref={CHAIN_SCAN_URL + contractAddr}
      />

      <Card
        title={t("anthologyState.shareQr")}
        content={<QRCodeGenerator text={shareUrl} />}
      />

      <Card
        title={t("anthologyState.shareLink")}
        content={
          <span
            title={t("anthologyState.shareLink")}
            style={{
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleCopyShareLink}
          >
            <img
              src="/icons/copy-icon.svg"
              alt={t("anthologyState.shareLink")}
              style={{
                width: "20px",
                height: "20px",
                display: "block",
                filter: "invert(1)",
              }}
            />
          </span>
        }
      />

      <Card
        title={t("anthologyState.saveToLocal")}
        content={
          <span
            title={t("anthologyState.saveToLocal")}
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={handleCloneToLocal}
          >
            💾
          </span>
        }
      />

      <Card title={t("anthologyState.owner")} content={anthologyState?.owner.toString()} />

      <Card title={t("anthologyState.title")} content={anthologyState?.title} />

      <Card
        title={t("anthologyState.memoirCount")}
        content={anthologyState?.currentMemoirCount.toString()}
      />

      <Card
        title={t("anthologyState.totalCreated")}
        content={anthologyState?.totalCreatedMemoirs.toString()}
      />

      <Card
        title={t("anthologyState.maxMemoirs")}
        content={anthologyState?.maxMemoirs.toString()}
      />

      <Card
        title={t("anthologyState.price")}
        content={anthologyState?.memoirPrice.toString()}
      />

      <Card
        title={t("anthologyState.tokenPayment")}
        content={
          anthologyState?.useERC20 ? t("common.enabled") : t("common.disabled")
        }
      />

      {anthologyState?.useERC20 && (
        <Card
          title={t("anthologyState.tokenAddress")}
          content={anthologyState?.erc20Token.toString()}
        />
      )}

      <Card
        title={t("anthologyState.buffer")}
        content={
          anthologyState?.useBuffer ? t("common.enabled") : t("common.disabled")
        }
      />

      <Card
        title={t("anthologyState.whitelistOnly")}
        content={
          anthologyState?.whitelistEnabled
            ? t("common.enabled")
            : t("common.disabled")
        }
      />

      <Card
        title={t("anthologyState.defaultSkin")}
        content={
          anthologyState?.skin
            ? removePadding(anthologyState.skin)
            : DEFAULT_SKIN
        }
      />
    </div>
  );
};
