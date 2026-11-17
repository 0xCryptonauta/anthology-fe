import type { CSSProperties } from "react";
import { Card } from "../Layout/Card";
import { SettingsRow } from "../Layout/SettingsRow";
import { settingsActionButtonStyle } from "../Layout/settingsStyles";

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
import { parseContractTitle } from "@src/utils/parseContractsCategories";

interface AnthologyStateProps {
  contractAddr: Address;
  /** Renders the SettingsRow layout used by the anthology panel. */
  embedded?: boolean;
}

const valueStyle: CSSProperties = {
  fontSize: "14px",
  color: "#cbd5e1",
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const linkStyle: CSSProperties = {
  ...valueStyle,
  color: "#7dd3fc",
};

const panelActionStyle: CSSProperties = {
  ...settingsActionButtonStyle,
  minWidth: "auto",
  minHeight: "36px",
};

export const AnthologyState: React.FC<AnthologyStateProps> = ({
  contractAddr,
  embedded = false,
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
  const displayTitle = anthologyState?.title
    ? parseContractTitle(anthologyState.title).title
    : "";

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

  if (embedded) {
    return (
      <div style={{ width: "100%" }}>
        <SettingsRow
          first
          label={t("anthologyState.address")}
          control={
            <a
              href={CHAIN_SCAN_URL + contractAddr}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              translate="no"
            >
              {contractAddr}
            </a>
          }
        />

        <SettingsRow
          label={t("anthologyState.shareQr")}
          control={<QRCodeGenerator text={shareUrl} />}
        />

        <SettingsRow
          label={t("anthologyState.shareLink")}
          control={
            <button
              type="button"
              title={t("anthologyState.shareLink")}
              aria-label={t("anthologyState.shareLink")}
              style={{
                ...panelActionStyle,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onClick={handleCopyShareLink}
            >
              <img
                src="/icons/copy-clipboard-icon.svg"
                alt=""
                style={{
                  width: "16px",
                  height: "16px",
                  display: "block",
                  filter: "invert(1)",
                }}
              />
              {t("anthologyState.shareLink")}
            </button>
          }
        />

        <SettingsRow
          label={t("anthologyState.saveToLocal")}
          control={
            <button
              type="button"
              title={t("anthologyState.saveToLocal")}
              aria-label={t("anthologyState.saveToLocal")}
              style={panelActionStyle}
              onClick={handleCloneToLocal}
            >
              {t("common.save")}
            </button>
          }
        />

        <SettingsRow
          label={t("anthologyState.owner")}
          control={
            <span style={valueStyle} translate="no">
              {anthologyState?.owner.toString()}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.title")}
          control={
            <span style={valueStyle} translate="no">
              {displayTitle}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.memoirCount")}
          control={
            <span style={valueStyle}>
              {anthologyState?.currentMemoirCount.toString()}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.totalCreated")}
          control={
            <span style={valueStyle}>
              {anthologyState?.totalCreatedMemoirs.toString()}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.maxMemoirs")}
          control={
            <span style={valueStyle}>
              {anthologyState?.maxMemoirs.toString()}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.price")}
          control={
            <span style={valueStyle}>
              {anthologyState?.memoirPrice.toString()}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.tokenPayment")}
          control={
            <span style={valueStyle}>
              {anthologyState?.useERC20
                ? t("common.enabled")
                : t("common.disabled")}
            </span>
          }
        />

        {anthologyState?.useERC20 && (
          <SettingsRow
            label={t("anthologyState.tokenAddress")}
            control={
              <span style={valueStyle} translate="no">
                {anthologyState?.erc20Token.toString()}
              </span>
            }
          />
        )}

        <SettingsRow
          label={t("anthologyState.buffer")}
          control={
            <span style={valueStyle}>
              {anthologyState?.useBuffer
                ? t("common.enabled")
                : t("common.disabled")}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.whitelistOnly")}
          control={
            <span style={valueStyle}>
              {anthologyState?.whitelistEnabled
                ? t("common.enabled")
                : t("common.disabled")}
            </span>
          }
        />

        <SettingsRow
          label={t("anthologyState.defaultSkin")}
          control={
            <span style={valueStyle}>
              {anthologyState?.skin
                ? removePadding(anthologyState.skin)
                : DEFAULT_SKIN}
            </span>
          }
        />
      </div>
    );
  }

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
          <button
            type="button"
            className="icon-button"
            title={t("anthologyState.shareLink")}
            aria-label={t("anthologyState.shareLink")}
            onClick={handleCopyShareLink}
          >
            <img
              src="/icons/copy-clipboard-icon.svg"
              alt=""
              style={{
                width: "20px",
                height: "20px",
                display: "block",
                filter: "invert(1)",
              }}
            />
          </button>
        }
      />

      <Card
        title={t("anthologyState.saveToLocal")}
        content={
          <button
            type="button"
            title={t("anthologyState.saveToLocal")}
            aria-label={t("anthologyState.saveToLocal")}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={handleCloneToLocal}
          >
            💾
          </button>
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
