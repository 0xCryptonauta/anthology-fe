import { useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import {
  addMemoirToUserLocalAnthology,
  deleteMemoirAtIndexFromUserLocalAnthology,
} from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { buildCopiedMemoir } from "@src/utils/memoirCopy";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { useConnection } from "wagmi";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";
import { ContractSelector } from "../Layout/ContractSelector";
import { useTranslation } from "@src/i18n/useTranslation";

interface MoveMemoirProps {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
  /** Read-only sources can only copy; moving would alter the source. */
  copyOnly?: boolean;
}

/**
 * Lightweight trigger. The destination selector and Wagmi/Redux work only
 * mount while the modal is open.
 */
export const MoveMemoir = ({
  anthologyAddr,
  index,
  memoir,
  copyOnly = false,
}: MoveMemoirProps) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={() => setShow(false)}
      height="min(700px, 90dvh)"
      trigger={
        <button
          type="button"
          className="icon-button"
          title={
            copyOnly ? t("connect.copyMemoirTitle") : t("move.title")
          }
          aria-label={
            copyOnly ? t("connect.copyMemoirTitle") : t("move.title")
          }
          style={{ fontSize: "1rem" }}
          onClick={() => setShow(true)}
        >
          <img
            src="/icons/copy-icon.svg"
            alt=""
            style={{ width: "18px", height: "18px", display: "block" }}
          />
        </button>
      }
    >
      {show && (
        <MoveMemoirForm
          anthologyAddr={anthologyAddr}
          index={index}
          memoir={memoir}
          copyOnly={copyOnly}
          onClose={() => setShow(false)}
        />
      )}
    </Modal>
  );
};

const MoveMemoirForm = ({
  anthologyAddr,
  index,
  memoir,
  copyOnly = false,
  onClose,
}: MoveMemoirProps & { onClose: () => void }) => {
  const { t } = useTranslation();
  const [destination, setDestination] = useState<Address | "">("");
  const [mode, setMode] = useState<"copy" | "move">("copy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { isConnected } = useConnection();
  const { userAddr } = useAppSelector((s) => s.user);
  const localContracts = useAppSelector(
    (s) => s.localAnthology.userContracts[LOCAL_USER_ADDR] || []
  );
  const receivedFrom = useAppSelector(
    (s) => s.localAnthology.receivedFrom ?? {}
  );
  const hasWritableDestination = localContracts.some(
    (address) => !receivedFrom[address]
  );

  const destIsLocal = destination !== "" && isLocalAnthology(destination);

  const destAnthology = useAppSelector((s) =>
    destination !== "" && !isLocalAnthology(destination)
      ? s.anthology[destination]
      : undefined
  );

  const canWriteToDest =
    destIsLocal ||
    !destAnthology ||
    !destAnthology.anthologyState?.whitelistEnabled ||
    destAnthology.whitelist?.includes(userAddr) ||
    userAddr === destAnthology.anthologyState?.owner;

  const handleConfirm = async () => {
    if (!destination) return;

    if (destination === anthologyAddr) {
      addToast({
        title: t("move.pickDifferent"),
        content: t("move.pickDifferentDesc"),
        variant: "info",
      });
      return;
    }

    if (!destIsLocal && !isConnected) {
      addToast({
        title: t("move.connectWallet"),
        content: t("move.connectWalletDesc"),
        variant: "info",
      });
      return;
    }

    if (!canWriteToDest) {
      addToast({
        title: t("move.notWhitelisted"),
        content: t("move.notWhitelistedDesc"),
        variant: "info",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (destIsLocal) {
        dispatch(
          addMemoirToUserLocalAnthology({
            contract: destination,
            memoir: copyOnly ? buildCopiedMemoir(memoir) : { ...memoir },
          })
        );
      } else {
        const txHash = await writeAnthology(destination, "createMemoir", [
          memoir.title,
          memoir.content,
        ]);

        if (!txHash) {
          addToast({
            title: t("memoir.copyFailed"),
            content: t("move.txNotSent"),
            variant: "danger",
          });
          return;
        }
      }

      if (mode === "move") {
        dispatch(
          deleteMemoirAtIndexFromUserLocalAnthology({
            contract: anthologyAddr,
            index,
          })
        );
      }

      addToast({
        title: mode === "move" ? t("move.moved") : t("move.copied"),
        content: destIsLocal ? t("move.savedLocal") : t("move.savedChain"),
        variant: "success",
        delay: 5000,
      });

      onClose();
    } catch (error) {
      console.error("Error copying/moving memoir:", error);
      addToast({
        title: t("move.errorTitle"),
        content: t("move.errorDesc"),
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
        maxWidth: "280px",
        maxHeight: "100%",
        minHeight: 0,
        boxSizing: "border-box",
      }}
    >
      <h4 style={{ textAlign: "center", margin: 0 }}>
        {copyOnly ? t("connect.copyMemoirTitle") : t("move.title")}
      </h4>

      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}>
        <ContractSelector
          setSelectedContract={setDestination}
          variant="light"
          showUserSelect={false}
        />
      </div>

      {copyOnly && !hasWritableDestination && (
        <p
          style={{
            margin: 0,
            color: "#b45309",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        >
          {t("connect.copyNoDestination")}
        </p>
      )}

      {!copyOnly && (
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              checked={mode === "copy"}
              onChange={() => setMode("copy")}
            />
            {t("move.copyTo")}
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              checked={mode === "move"}
              onChange={() => setMode("move")}
            />
            {t("move.moveTo")}
          </label>
        </div>
      )}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={
          !destination ||
          isSubmitting ||
          (copyOnly && !hasWritableDestination)
        }
        style={{
          padding: "0.75rem 1.25rem",
          borderRadius: "0.75rem",
          fontWeight: 600,
          fontSize: "0.95rem",
          backgroundColor: "#111827",
          color: "#fff",
          border: "none",
          cursor:
            destination && !isSubmitting && (!copyOnly || hasWritableDestination)
              ? "pointer"
              : "not-allowed",
          opacity:
            destination && !isSubmitting && (!copyOnly || hasWritableDestination)
              ? 1
              : 0.6,
        }}
      >
        {isSubmitting
          ? t("move.saving")
          : copyOnly
          ? t("move.copy")
          : mode === "move"
          ? t("move.move")
          : t("move.copy")}
      </button>
    </div>
  );
};
