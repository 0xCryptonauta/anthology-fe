import { useState, useMemo } from "react";
import { parseEther } from "viem";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { useToast } from "@components/Layout/Toast";

import { useAppSelector, useAppDispatch } from "@store/utils/hooks";
import {
  updateAnthologyTitle,
  updateUseBuffer,
  updateUseErc20,
  updateWhitelistEnabled,
} from "@store/slices/anthologySlice";

import { updateOneContractTitle } from "@store/slices/factorySlice";
import { Address, MemoirContent } from "@src/types/common";
import { ChangeAnthologyDefaultSkin } from "./ChangeAnthologyDefaultSkin";
import { TitleEditor } from "@components/Factory/TitleEditor";
import { Modal } from "@src/components/Layout/Modal";
import { SettingsRow } from "@src/components/Layout/SettingsRow";
import { settingsActionButtonStyle } from "@src/components/Layout/settingsStyles";
import { useTranslation } from "@src/i18n/useTranslation";
import { parseContractTitle } from "@src/utils/parseContractsCategories";

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxSizing: "border-box",
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "8px",
  width: "100%",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px 10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#fff",
  color: "#111",
  fontSize: "14px",
  outline: "none",
};

const actionBtnStyle: React.CSSProperties = {
  backgroundColor: "#111827",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const panelActionStyle: React.CSSProperties = {
  ...settingsActionButtonStyle,
  minWidth: "auto",
  minHeight: "36px",
};

const panelDangerStyle: React.CSSProperties = {
  ...panelActionStyle,
  backgroundColor: "#7f1d1d",
  border: "1px solid #991b1b",
  color: "#fecaca",
};

const panelFieldGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "8px",
  flexWrap: "wrap",
  width: "100%",
};

const panelInputStyle: React.CSSProperties = {
  flex: "1 1 140px",
  minWidth: 0,
  maxWidth: "220px",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #30363d",
  backgroundColor: "#0d1117",
  color: "#e6edf3",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export const AnthologyOwner = ({
  contractAddr,
  embedded = false,
}: {
  contractAddr: Address;
  /** Renders the SettingsRow layout used by the anthology panel. */
  embedded?: boolean;
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const anthologyState = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr]?.anthologyState : undefined
  );
  const displayTitle = anthologyState?.title
    ? parseContractTitle(anthologyState.title).title
    : "";

  const dispatch = useAppDispatch();

  const {
    contractsTitles: factoryTitles,
    userContracts: factoryUserContracts,
  } = useAppSelector((state) => state.factory);

  const userTitles: MemoirContent[] = useMemo(() => {
    const owner = anthologyState?.owner;
    const contracts = owner ? factoryUserContracts?.[owner] : undefined;
    if (!contracts) return [];
    return contracts.map((addr, i) => ({
      address: addr,
      title: factoryTitles[addr] || "",
      originalIndex: i,
    }));
  }, [factoryTitles, factoryUserContracts, anthologyState?.owner]);

  const [addressToAdd, setAddresToAdd] = useState("");
  const [addressToRemove, setAddressToRemove] = useState("");
  const [erc20TokenAddr, setErc20TokenAddr] = useState("");
  const [memoirPrice, setMemoirPrice] = useState<string>("0");
  const [newMaxMemoirs, setNewMaxMemoirs] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [confirmCleanType, setConfirmCleanType] = useState<
    "memoirs" | "buffer" | "whitelist" | null
  >(null);

  const handleCloseTitleModal = () => setShowTitleModal(false);

  const handleTitleSubmit = async (combinedTitle: string) => {
    try {
      const txHash = await writeAnthology(contractAddr, "setTitle", [
        [combinedTitle],
      ]);
      if (txHash) {
        addToast({
          title: t("owner.newTitleToast"),
          content: combinedTitle,
          variant: "success",
          delay: 5000,
        });
        dispatch(
          updateAnthologyTitle({
            contract: contractAddr,
            title: combinedTitle,
          })
        );
        dispatch(
          updateOneContractTitle({
            contract: contractAddr,
            title: combinedTitle,
          })
        );
        handleCloseTitleModal();
      }
    } catch (error) {
      addToast({
        title: t("owner.errorTitle"),
        content: t("common.unknownError"),
        variant: "warning",
        delay: 5000,
      });
      console.error("Error setting new title", error);
    }
  };

  const handleConfirmedClean = async () => {
    if (!confirmCleanType) return;
    const currentType = confirmCleanType;
    setConfirmCleanType(null);

    try {
      if (currentType === "memoirs") {
        const txHash = await writeAnthology(contractAddr, "cleanMemoirs");
        if (txHash) {
          addToast({
            title: t("owner.cleaningMemoirs"),
            content: "txHash: " + txHash,
            variant: "success",
            delay: 5000,
          });
        }
      } else if (currentType === "buffer") {
        const txHash = await writeAnthology(contractAddr, "cleanMemoirBuffer");
        if (txHash) {
          addToast({
            title: t("owner.cleaningBuffer"),
            content: "txHash: " + txHash,
            variant: "success",
            delay: 5000,
          });
        }
      } else if (currentType === "whitelist") {
        const txHash = await writeAnthology(contractAddr, "cleanWhitelist");
        if (txHash) {
          addToast({
            title: t("owner.cleaningWhitelist"),
            content: "txHash: " + txHash,
            variant: "success",
            delay: 5000,
          });
        }
      }
    } catch (error) {
      addToast({
        title: t("owner.errorCleaning", { target: currentType }),
        content: t("common.unknownError"),
        variant: "warning",
        delay: 5000,
      });
      console.error(`Error cleaning ${currentType}`, error);
    }
  };

  if (embedded) {
    return (
      <>
        <div style={{ width: "100%" }}>
          <SettingsRow
            first
            label={t("anthologyState.title")}
            description={displayTitle}
            control={
              <Modal
                placement="bottom"
                show={showTitleModal}
                onHide={handleCloseTitleModal}
                trigger={
                  <button
                    type="button"
                    style={panelActionStyle}
                    onClick={() => setShowTitleModal(true)}
                  >
                    {t("common.change")}
                  </button>
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem 1rem",
                    width: "100%",
                    maxWidth: "320px",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#111827",
                      textAlign: "center",
                    }}
                  >
                    {t("owner.setNewTitle")}
                  </span>
                  <TitleEditor
                    initialTitle={anthologyState?.title || ""}
                    userTitles={userTitles}
                    submitLabel={t("owner.changeTitle")}
                    onSubmit={handleTitleSubmit}
                  />
                </div>
              </Modal>
            }
          />

          <SettingsRow
            label={t("anthologyState.defaultSkin")}
            control={
              <ChangeAnthologyDefaultSkin contractAddr={contractAddr} embedded />
            }
          />

          <SettingsRow
            label={t("owner.price")}
            control={
              <div style={panelFieldGroupStyle}>
                <input
                  type="number"
                  aria-label={t("owner.price")}
                  placeholder="0"
                  value={memoirPrice}
                  onChange={(event) => setMemoirPrice(event.target.value)}
                  autoComplete="new-password"
                  style={panelInputStyle}
                />
                <button
                  type="button"
                  style={panelActionStyle}
                  onClick={async () => {
                    try {
                      const txHash = await writeAnthology(
                        contractAddr,
                        "setMemoirPrice",
                        [parseEther(memoirPrice)]
                      );
                      if (txHash) {
                        addToast({
                          title: t("owner.priceSet"),
                          content: memoirPrice,
                          variant: "success",
                          delay: 5000,
                        });
                      }
                    } catch (error) {
                      addToast({
                        title: t("owner.errorPrice"),
                        content: t("common.unknownError"),
                        variant: "warning",
                        delay: 5000,
                      });
                      console.error("Error setting new price", error);
                    }
                  }}
                >
                  {t("common.save")}
                </button>
              </div>
            }
          />

          <SettingsRow
            label={t("owner.maxMemoirs")}
            control={
              <div style={panelFieldGroupStyle}>
                <input
                  type="number"
                  aria-label={t("owner.maxMemoirs")}
                  placeholder={t("owner.maxPlaceholder")}
                  value={newMaxMemoirs}
                  onChange={(event) => setNewMaxMemoirs(event.target.value)}
                  autoComplete="new-password"
                  style={panelInputStyle}
                />
                <button
                  type="button"
                  style={panelActionStyle}
                  onClick={async () => {
                    try {
                      const txHash = await writeAnthology(
                        contractAddr,
                        "setMaxMemoirs",
                        [newMaxMemoirs]
                      );
                      if (txHash) {
                        addToast({
                          title: t("owner.maxSet"),
                          content: newMaxMemoirs + "\n\nTxHash: " + txHash,
                          variant: "success",
                          delay: 5000,
                        });
                      }
                    } catch (error) {
                      addToast({
                        title: t("owner.errorMax"),
                        content: t("common.unknownError"),
                        variant: "warning",
                        delay: 5000,
                      });
                      console.error("Error setting new maxMemoirs", error);
                    }
                  }}
                >
                  {t("common.save")}
                </button>
              </div>
            }
          />

          <SettingsRow
            label={t("owner.paymentMethod")}
            description={
              anthologyState?.useERC20
                ? t("common.enabled")
                : t("common.disabled")
            }
            control={
              <button
                type="button"
                style={panelActionStyle}
                onClick={async () => {
                  try {
                    const txHash = await writeAnthology(
                      contractAddr,
                      "setUseERC20",
                      [!anthologyState?.useERC20]
                    );
                    if (txHash) {
                      addToast({
                        title: t("owner.paymentChanged"),
                        content:
                          !anthologyState?.useERC20 +
                          "\n\nTxHash: " +
                          txHash,
                        variant: "success",
                        delay: 5000,
                      });
                      dispatch(
                        updateUseErc20({
                          contract: contractAddr,
                          useERC20: !anthologyState?.useERC20,
                        })
                      );
                    }
                  } catch (error) {
                    addToast({
                      title: t("owner.errorPayment"),
                      content: t("common.unknownError"),
                      variant: "warning",
                      delay: 5000,
                    });
                    console.error("Error setting", error);
                  }
                }}
              >
                {anthologyState?.useERC20
                  ? t("owner.switchToEth")
                  : t("owner.switchToToken")}
              </button>
            }
          />

          <SettingsRow
            label={t("anthologyState.tokenAddress")}
            control={
              <div style={panelFieldGroupStyle}>
                <input
                  type="text"
                  aria-label={t("anthologyState.tokenAddress")}
                  placeholder={t("owner.tokenPlaceholder")}
                  value={erc20TokenAddr}
                  onChange={(event) => setErc20TokenAddr(event.target.value)}
                  autoComplete="new-password"
                  style={panelInputStyle}
                />
                <button
                  type="button"
                  style={panelActionStyle}
                  onClick={async () => {
                    try {
                      const txHash = await writeAnthology(
                        contractAddr,
                        "setERC20Token",
                        [erc20TokenAddr]
                      );
                      if (txHash) {
                        addToast({
                          title: t("owner.tokenSet"),
                          content: erc20TokenAddr + "\n\nTxHash: " + txHash,
                          variant: "success",
                          delay: 5000,
                        });
                      }
                    } catch (error) {
                      addToast({
                        title: t("owner.errorToken"),
                        content: t("common.unknownError"),
                        variant: "warning",
                        delay: 5000,
                      });
                      console.error("Error setting erc20 address", error);
                    }
                  }}
                >
                  {t("owner.setToken")}
                </button>
              </div>
            }
          />

          <SettingsRow
            label={t("owner.whitelist")}
            description={
              anthologyState?.whitelistEnabled
                ? t("common.enabled")
                : t("common.disabled")
            }
            control={
              <button
                type="button"
                style={panelActionStyle}
                onClick={async () => {
                  try {
                    const txHash = await writeAnthology(
                      contractAddr,
                      "enableWhitelist",
                      [!anthologyState?.whitelistEnabled]
                    );
                    if (txHash) {
                      addToast({
                        title: t("owner.whitelistChanged"),
                        content: !anthologyState?.whitelistEnabled
                          ? t("owner.whitelistActivated")
                          : t("owner.whitelistDisabled") +
                            "\n\nTxHash: " +
                            txHash,
                        variant: "success",
                        delay: 5000,
                      });
                      dispatch(
                        updateWhitelistEnabled({
                          contract: contractAddr,
                          whitelistEnabled: !anthologyState?.whitelistEnabled,
                        })
                      );
                    }
                  } catch (error) {
                    addToast({
                      title: t("owner.errorWhitelist"),
                      content: t("common.unknownError"),
                      variant: "warning",
                      delay: 5000,
                    });
                    console.error("Error setting whitelist", error);
                  }
                }}
              >
                {anthologyState?.whitelistEnabled
                  ? t("owner.disableWhitelist")
                  : t("owner.enableWhitelist")}
              </button>
            }
          />

          <SettingsRow
            label={t("owner.addressAllow")}
            control={
              <div style={panelFieldGroupStyle}>
                <input
                  type="text"
                  aria-label={t("owner.addressAllow")}
                  placeholder={t("owner.addressAllow")}
                  value={addressToAdd}
                  onChange={(event) => setAddresToAdd(event.target.value)}
                  autoComplete="new-password"
                  style={panelInputStyle}
                />
                <button
                  type="button"
                  style={panelActionStyle}
                  onClick={async () => {
                    try {
                      const txHash = await writeAnthology(
                        contractAddr,
                        "addToWhitelist",
                        [addressToAdd]
                      );
                      if (txHash) {
                        addToast({
                          title: t("owner.addedToWhitelist"),
                          content:
                            addressToAdd + "\n\nTxHash: " + txHash,
                          variant: "success",
                          delay: 5000,
                        });
                      }
                    } catch (error) {
                      addToast({
                        title: t("owner.errorAddWL"),
                        content: t("common.unknownError"),
                        variant: "warning",
                        delay: 5000,
                      });
                      console.error("Error adding to whitelist", error);
                    }
                  }}
                >
                  {t("common.add")}
                </button>
              </div>
            }
          />

          <SettingsRow
            label={t("owner.addressRemove")}
            control={
              <div style={panelFieldGroupStyle}>
                <input
                  type="text"
                  aria-label={t("owner.addressRemove")}
                  placeholder={t("owner.addressRemove")}
                  value={addressToRemove}
                  onChange={(event) => setAddressToRemove(event.target.value)}
                  autoComplete="new-password"
                  style={panelInputStyle}
                />
                <button
                  type="button"
                  style={panelActionStyle}
                  onClick={async () => {
                    try {
                      const txHash = await writeAnthology(
                        contractAddr,
                        "removeFromWhitelist",
                        [addressToRemove]
                      );
                      if (txHash) {
                        addToast({
                          title: t("owner.removedFromWhitelist"),
                          content:
                            addressToRemove + "\n\nTxHash: " + txHash,
                          variant: "success",
                          delay: 5000,
                        });
                      }
                    } catch (error) {
                      addToast({
                        title: t("owner.errorRemoveWL"),
                        content: t("common.unknownError"),
                        variant: "warning",
                        delay: 5000,
                      });
                      console.error("Error removing from whitelist", error);
                    }
                  }}
                >
                  {t("common.remove")}
                </button>
              </div>
            }
          />

          <SettingsRow
            label={t("owner.buffer")}
            description={
              anthologyState?.useBuffer
                ? t("common.enabled")
                : t("common.disabled")
            }
            control={
              <button
                type="button"
                style={panelActionStyle}
                onClick={async () => {
                  try {
                    const txHash = await writeAnthology(
                      contractAddr,
                      "setUseBuffer",
                      [!anthologyState?.useBuffer]
                    );
                    if (txHash) {
                      addToast({
                        title: t("owner.bufferChanged"),
                        content: !anthologyState?.useBuffer
                          ? t("owner.bufferActivated")
                          : t("owner.bufferDisabled") +
                            "\n\nTxHash: " +
                            txHash,
                        variant: "success",
                        delay: 5000,
                      });
                      dispatch(
                        updateUseBuffer({
                          contract: contractAddr,
                          useBuffer: !anthologyState?.useBuffer,
                        })
                      );
                    }
                  } catch (error) {
                    addToast({
                      title: t("owner.errorBuffer"),
                      content: t("common.unknownError"),
                      variant: "warning",
                      delay: 5000,
                    });
                    console.error("Error setting buffer status", error);
                  }
                }}
              >
                {anthologyState?.useBuffer
                  ? t("owner.disableBuffer")
                  : t("owner.enableBuffer")}
              </button>
            }
          />

          <SettingsRow
            danger
            label={t("owner.dangerZone")}
            control={
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  style={panelDangerStyle}
                  onClick={() => setConfirmCleanType("memoirs")}
                >
                  {t("owner.deleteAllMemoirs")}
                </button>
                <button
                  type="button"
                  style={panelDangerStyle}
                  onClick={() => setConfirmCleanType("buffer")}
                >
                  {t("owner.clearBuffer")}
                </button>
                <button
                  type="button"
                  style={panelDangerStyle}
                  onClick={() => setConfirmCleanType("whitelist")}
                >
                  {t("owner.clearWhitelist")}
                </button>
              </div>
            }
          />
        </div>

        <Modal
          placement="bottom"
          show={confirmCleanType !== null}
          onHide={() => setConfirmCleanType(null)}
          trigger={<span style={{ display: "none" }} />}
        >
          <div
            style={{
              margin: "24px 10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              color: "#1a1a1a",
            }}
          >
            <span style={{ fontWeight: "bold", textAlign: "center" }}>
              {confirmCleanType === "memoirs"
                ? t("owner.deleteAllTitle")
                : confirmCleanType === "buffer"
                ? t("owner.confirmClearBuffer")
                : t("owner.confirmClearWhitelist")}
            </span>
            <span style={{ textAlign: "center" }}>
              {confirmCleanType === "memoirs"
                ? t("owner.confirmDeleteAllBody", {
                    title: displayTitle || t("owner.thisAnthology"),
                  })
                : confirmCleanType === "buffer"
                ? t("owner.confirmClearBufferBody", {
                    title: displayTitle || t("owner.thisAnthology"),
                  })
                : t("owner.confirmClearWhitelistBody", {
                    title: displayTitle || t("owner.thisAnthology"),
                  })}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              style={{
                backgroundColor: "#e2e8f0",
                color: "#1a1a1a",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setConfirmCleanType(null)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={handleConfirmedClean}
            >
              {t("common.confirm")}
            </button>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        maxWidth: "360px",
        padding: "14px",
        borderRadius: "10px",
        margin: "20px 5px",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ fontSize: "1.2rem", fontWeight: 600, margin: 0 }}>
        {t("owner.settingsTitle")}
      </h3>

      {/* ------------------------------- Update Anthology title ------------------------------ */}
      <Modal
        placement="bottom"
        show={showTitleModal}
        onHide={handleCloseTitleModal}
        trigger={
          <button
            style={{
              backgroundColor: "dodgerblue",
              border: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
              width: "100%",
            }}
            onClick={() => setShowTitleModal(true)}
          >
            {t("owner.changeTitle")}
          </button>
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem 1rem",
            width: "100%",
            maxWidth: "320px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#111827",
              textAlign: "center",
            }}
          >
            {t("owner.setNewTitle")}
          </span>
          <TitleEditor
            initialTitle={anthologyState?.title || ""}
            userTitles={userTitles}
            submitLabel={t("owner.changeTitle")}
            onSubmit={handleTitleSubmit}
          />
        </div>
      </Modal>

      {/* ------------------------------- setDefaultSkin ------------------------------ */}
      <ChangeAnthologyDefaultSkin contractAddr={contractAddr} />

      {/* ------------------------------- Update Anthology price ------------------------------ */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          {t("owner.price")}
        </span>
        <div style={inputRowStyle}>
          <input
            type="number"
            placeholder="0"
            value={memoirPrice}
            onChange={(event) => setMemoirPrice(event.target.value)}
            autoComplete="new-password"
            style={inputStyle}
          />
          <button
            style={actionBtnStyle}
            onClick={async () => {
              try {
                const txHash = await writeAnthology(
                  contractAddr,
                  "setMemoirPrice",
                  [parseEther(memoirPrice)]
                );
                if (txHash) {
                  addToast({
                    title: t("owner.priceSet"),
                    content: memoirPrice,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: t("owner.errorPrice"),
                  content: t("common.unknownError"),
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting new price", error);
              }
            }}
          >
            {t("common.save")}
          </button>
        </div>
      </div>

      {/* ------------------------------- setMaxMemoirs ------------------------------ */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          {t("owner.maxMemoirs")}
        </span>
        <div style={inputRowStyle}>
          <input
            type="number"
            placeholder={t("owner.maxPlaceholder")}
            value={newMaxMemoirs}
            onChange={(event) => setNewMaxMemoirs(event.target.value)}
            autoComplete="new-password"
            style={inputStyle}
          />
          <button
            style={actionBtnStyle}
            onClick={async () => {
              try {
                const txHash = await writeAnthology(
                  contractAddr,
                  "setMaxMemoirs",
                  [newMaxMemoirs]
                );
                if (txHash) {
                  addToast({
                    title: t("owner.maxSet"),
                    content: newMaxMemoirs + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: t("owner.errorMax"),
                  content: t("common.unknownError"),
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting new maxMemoirs", error);
              }
            }}
          >
            {t("common.save")}
          </button>
        </div>
      </div>

      {/* ---------------------------------- Toggle useERC20 & Token ---------------------------------- */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          {t("owner.paymentMethod")}
        </span>
        <button
          style={{ ...actionBtnStyle, width: "100%" }}
          onClick={async () => {
            try {
              const txHash = await writeAnthology(contractAddr, "setUseERC20", [
                !anthologyState?.useERC20,
              ]);
              if (txHash) {
                addToast({
                  title: t("owner.paymentChanged"),
                  content: !anthologyState?.useERC20 + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateUseErc20({
                    contract: contractAddr,
                    useERC20: !anthologyState?.useERC20,
                  })
                );
              }
            } catch (error) {
              addToast({
                title: t("owner.errorPayment"),
                content: t("common.unknownError"),
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting", error);
            }
          }}
        >
          {anthologyState && anthologyState.useERC20
            ? t("owner.switchToEth")
            : t("owner.switchToToken")}
        </button>

        <div style={{ ...inputRowStyle, marginTop: "4px" }}>
          <input
            type="text"
            placeholder={t("owner.tokenPlaceholder")}
            value={erc20TokenAddr}
            onChange={(event) => setErc20TokenAddr(event.target.value)}
            autoComplete="new-password"
            style={inputStyle}
          />
          <button
            style={actionBtnStyle}
            onClick={async () => {
              try {
                const txHash = await writeAnthology(
                  contractAddr,
                  "setERC20Token",
                  [erc20TokenAddr]
                );
                if (txHash) {
                  addToast({
                    title: t("owner.tokenSet"),
                    content: erc20TokenAddr + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: t("owner.errorToken"),
                  content: t("common.unknownError"),
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting erc20 address", error);
              }
            }}
          >
            {t("owner.setToken")}
          </button>
        </div>
      </div>

      {/* ---------------------------------- Whitelist Controls --------------------------------- */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          {t("owner.whitelist")}
        </span>
        <button
          style={{ ...actionBtnStyle, width: "100%" }}
          onClick={async () => {
            try {
              const txHash = await writeAnthology(
                contractAddr,
                "enableWhitelist",
                [!anthologyState?.whitelistEnabled]
              );
              if (txHash) {
                addToast({
                  title: t("owner.whitelistChanged"),
                  content: !anthologyState?.whitelistEnabled
                    ? t("owner.whitelistActivated")
                    : t("owner.whitelistDisabled") + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateWhitelistEnabled({
                    contract: contractAddr,
                    whitelistEnabled: !anthologyState?.whitelistEnabled,
                  })
                );
              }
            } catch (error) {
              addToast({
                title: t("owner.errorWhitelist"),
                content: t("common.unknownError"),
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting whitelist", error);
            }
          }}
        >
          {anthologyState && anthologyState?.whitelistEnabled
            ? t("owner.disableWhitelist")
            : t("owner.enableWhitelist")}
        </button>

        <div style={{ ...inputRowStyle, marginTop: "4px" }}>
          <input
            type="text"
            placeholder={t("owner.addressAllow")}
            value={addressToAdd}
            onChange={(event) => setAddresToAdd(event.target.value)}
            autoComplete="new-password"
            style={inputStyle}
          />
          <button
            style={actionBtnStyle}
            onClick={async () => {
              try {
                const txHash = await writeAnthology(
                  contractAddr,
                  "addToWhitelist",
                  [addressToAdd]
                );
                if (txHash) {
                  addToast({
                    title: t("owner.addedToWhitelist"),
                    content: addressToAdd + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: t("owner.errorAddWL"),
                  content: t("common.unknownError"),
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error adding to whitelist", error);
              }
            }}
          >
            {t("common.add")}
          </button>
        </div>

        <div style={inputRowStyle}>
          <input
            type="text"
            placeholder={t("owner.addressRemove")}
            value={addressToRemove}
            onChange={(event) => setAddressToRemove(event.target.value)}
            autoComplete="new-password"
            style={inputStyle}
          />
          <button
            style={actionBtnStyle}
            onClick={async () => {
              try {
                const txHash = await writeAnthology(
                  contractAddr,
                  "removeFromWhitelist",
                  [addressToRemove]
                );
                if (txHash) {
                  addToast({
                    title: t("owner.removedFromWhitelist"),
                    content: addressToRemove + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: t("owner.errorRemoveWL"),
                  content: t("common.unknownError"),
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error removing from whitelist", error);
              }
            }}
          >
            {t("common.remove")}
          </button>
        </div>
      </div>

      {/* ----------------------------------- Set useBuffer ------------------------------------ */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          {t("owner.buffer")}
        </span>
        <button
          style={{ ...actionBtnStyle, width: "100%" }}
          onClick={async () => {
            try {
              const txHash = await writeAnthology(
                contractAddr,
                "setUseBuffer",
                [!anthologyState?.useBuffer]
              );
              if (txHash) {
                addToast({
                  title: t("owner.bufferChanged"),
                  content: !anthologyState?.useBuffer
                    ? t("owner.bufferActivated")
                    : t("owner.bufferDisabled") + "\n\nTxHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
                dispatch(
                  updateUseBuffer({
                    contract: contractAddr,
                    useBuffer: !anthologyState?.useBuffer,
                  })
                );
              }
            } catch (error) {
              addToast({
                title: t("owner.errorBuffer"),
                content: t("common.unknownError"),
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting buffer status", error);
            }
          }}
        >
          {anthologyState?.useBuffer
            ? t("owner.disableBuffer")
            : t("owner.enableBuffer")}
        </button>
      </div>

      {/* ----------------------------------- Destructive Actions ------------------------------------ */}
      <div
        style={{
          ...sectionStyle,
          borderColor: "rgba(220, 38, 38, 0.4)",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#fca5a5" }}>
          {t("owner.dangerZone")}
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              flex: 1,
            }}
            onClick={() => setConfirmCleanType("memoirs")}
          >
            {t("owner.deleteAllMemoirs")}
          </button>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              flex: 1,
            }}
            onClick={() => setConfirmCleanType("buffer")}
          >
            {t("owner.clearBuffer")}
          </button>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
              flex: 1,
            }}
            onClick={() => setConfirmCleanType("whitelist")}
          >
            {t("owner.clearWhitelist")}
          </button>
        </div>
      </div>

      <Modal
        placement="bottom"
        show={confirmCleanType !== null}
        onHide={() => setConfirmCleanType(null)}
        trigger={<span style={{ display: "none" }} />}
      >
        <div
          style={{
            margin: "24px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "#1a1a1a",
          }}
        >
          <span style={{ fontWeight: "bold", textAlign: "center" }}>
            {confirmCleanType === "memoirs"
              ? t("owner.deleteAllTitle")
              : confirmCleanType === "buffer"
              ? t("owner.confirmClearBuffer")
              : t("owner.confirmClearWhitelist")}
          </span>
          <span style={{ textAlign: "center" }}>
            {confirmCleanType === "memoirs"
              ? t("owner.confirmDeleteAllBody", {
                  title: anthologyState?.title || t("owner.thisAnthology"),
                })
              : confirmCleanType === "buffer"
              ? t("owner.confirmClearBufferBody", {
                  title: anthologyState?.title || t("owner.thisAnthology"),
                })
              : t("owner.confirmClearWhitelistBody", {
                  title: anthologyState?.title || t("owner.thisAnthology"),
                })}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            style={{
              backgroundColor: "#e2e8f0",
              color: "#1a1a1a",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setConfirmCleanType(null)}
          >
            {t("common.cancel")}
          </button>
          <button
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleConfirmedClean}
          >
            {t("common.confirm")}
          </button>
        </div>
      </Modal>
    </div>
  );
};
