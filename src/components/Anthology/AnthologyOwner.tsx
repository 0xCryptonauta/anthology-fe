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

export const AnthologyOwner = ({ contractAddr }: { contractAddr: Address }) => {
  const { addToast } = useToast();

  const anthologyState = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr]?.anthologyState : undefined
  );

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
          title: "New title:",
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
        title: "Error setting new title",
        content: "Unknown error",
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
            title: "Cleaning memoirs",
            content: "txHash: " + txHash,
            variant: "success",
            delay: 5000,
          });
        }
      } else if (currentType === "buffer") {
        const txHash = await writeAnthology(contractAddr, "cleanMemoirBuffer");
        if (txHash) {
          addToast({
            title: "Cleaning memoir buffer",
            content: "txHash: " + txHash,
            variant: "success",
            delay: 5000,
          });
        }
      } else if (currentType === "whitelist") {
        const txHash = await writeAnthology(contractAddr, "cleanWhitelist");
        if (txHash) {
          addToast({
            title: "Cleaning whitelist",
            content: "txHash: " + txHash,
            variant: "success",
            delay: 5000,
          });
        }
      }
    } catch (error) {
      addToast({
        title: `Error cleaning ${currentType}`,
        content: "Unknown error",
        variant: "warning",
        delay: 5000,
      });
      console.error(`Error cleaning ${currentType}`, error);
    }
  };

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
        Anthology Settings
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
            Change title
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
            Set New Title
          </span>
          <TitleEditor
            initialTitle={anthologyState?.title || ""}
            userTitles={userTitles}
            submitLabel="Change title"
            onSubmit={handleTitleSubmit}
          />
        </div>
      </Modal>

      {/* ------------------------------- setDefaultSkin ------------------------------ */}
      <ChangeAnthologyDefaultSkin contractAddr={contractAddr} />

      {/* ------------------------------- Update Anthology price ------------------------------ */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          Price per memoir
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
                    title: "New price:",
                    content: memoirPrice,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: "Error setting new price",
                  content: "Unknown error",
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting new price", error);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* ------------------------------- setMaxMemoirs ------------------------------ */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          Max memoirs allowed
        </span>
        <div style={inputRowStyle}>
          <input
            type="number"
            placeholder="Max memoirs"
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
                    title: "New max number of memoirs:",
                    content: newMaxMemoirs + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: "Error setting max memoirs",
                  content: "Unknown error",
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting new maxMemoirs", error);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* ---------------------------------- Toggle useERC20 & Token ---------------------------------- */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          Payment method
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
                  title: "Payment method changed to:",
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
                title: "Error updating payment method",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting", error);
            }
          }}
        >
          {anthologyState && anthologyState.useERC20
            ? "Switch to ETH payment"
            : "Switch to Token (ERC20) payment"}
        </button>

        <div style={{ ...inputRowStyle, marginTop: "4px" }}>
          <input
            type="text"
            placeholder="Token contract address (0x...)"
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
                    title: "Token address set to:",
                    content: erc20TokenAddr + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: "Error setting token address",
                  content: "Unknown error",
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error setting erc20 address", error);
              }
            }}
          >
            Set Token
          </button>
        </div>
      </div>

      {/* ---------------------------------- Whitelist Controls --------------------------------- */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>Whitelist</span>
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
                  title: "Whitelist has been:",
                  content: !anthologyState?.whitelistEnabled
                    ? "Activated"
                    : "Disabled" + "\n\nTxHash: " + txHash,
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
                title: "Error updating whitelist",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting whitelist", error);
            }
          }}
        >
          {anthologyState && anthologyState?.whitelistEnabled
            ? "Disable whitelist"
            : "Enable whitelist"}
        </button>

        <div style={{ ...inputRowStyle, marginTop: "4px" }}>
          <input
            type="text"
            placeholder="Address to allow (0x...)"
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
                    title: "Address added to whitelist",
                    content: addressToAdd + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: "Error adding to whitelist",
                  content: "Unknown error",
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error adding to whitelist", error);
              }
            }}
          >
            Add
          </button>
        </div>

        <div style={inputRowStyle}>
          <input
            type="text"
            placeholder="Address to remove (0x...)"
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
                    title: "Address removed from whitelist",
                    content: addressToRemove + "\n\nTxHash: " + txHash,
                    variant: "success",
                    delay: 5000,
                  });
                }
              } catch (error) {
                addToast({
                  title: "Error removing from whitelist",
                  content: "Unknown error",
                  variant: "warning",
                  delay: 5000,
                });
                console.error("Error removing from whitelist", error);
              }
            }}
          >
            Remove
          </button>
        </div>
      </div>

      {/* ----------------------------------- Set useBuffer ------------------------------------ */}
      <div style={sectionStyle}>
        <span style={{ fontSize: "14px", fontWeight: 500 }}>
          Moderation buffer
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
                  title: "Buffer has been:",
                  content: !anthologyState?.useBuffer
                    ? "Activated"
                    : "Disabled" + "\n\nTxHash: " + txHash,
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
                title: "Error updating buffer status",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error setting buffer status", error);
            }
          }}
        >
          {anthologyState?.useBuffer
            ? "Disable moderation buffer"
            : "Enable moderation buffer"}
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
          Danger Zone
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
            Delete all memoirs
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
            Clear buffer
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
            Clear whitelist
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
              ? "Delete all memoirs in this anthology?"
              : confirmCleanType === "buffer"
              ? "Clear all pending memoirs in the moderation buffer?"
              : "Remove all addresses from the whitelist?"}
          </span>
          <span style={{ textAlign: "center" }}>
            This will send a blockchain transaction to clear the{" "}
            {confirmCleanType === "memoirs"
              ? "memoirs"
              : confirmCleanType === "buffer"
              ? "moderation buffer"
              : "whitelist"}{" "}
            in <strong>{anthologyState?.title || "this anthology"}</strong>.
            This action cannot be undone.
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
            Cancel
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
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};
