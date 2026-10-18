import { useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import {
  addMemoirToUserLocalAnthology,
  deleteMemoirAtIndexFromUserLocalAnthology,
} from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { useAccount } from "wagmi";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";
import { ContractSelector } from "../Layout/ContractSelector";

export const MoveMemoir = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => {
  const [show, setShow] = useState(false);
  const [destination, setDestination] = useState<Address | "">("");
  const [mode, setMode] = useState<"copy" | "move">("copy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { isConnected } = useAccount();
  const { userAddr } = useAppSelector((s) => s.user);

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
        title: "Pick a different anthology",
        content: "The destination is the current anthology.",
        variant: "info",
      });
      return;
    }

    if (!destIsLocal && !isConnected) {
      addToast({
        title: "Connect your wallet",
        content: "A blockchain destination needs a connected wallet.",
        variant: "info",
      });
      return;
    }

    if (!canWriteToDest) {
      addToast({
        title: "Not whitelisted",
        content: "You are not whitelisted in the destination anthology.",
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
            memoir: { ...memoir },
          })
        );
      } else {
        const txHash = await writeAnthology(destination, "createMemoir", [
          memoir.title,
          memoir.content,
        ]);

        if (!txHash) {
          addToast({
            title: "Copy failed",
            content: "The transaction was not sent.",
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
        title: mode === "move" ? "Memoir moved" : "Memoir copied",
        content: destIsLocal
          ? "Saved to the selected local anthology"
          : "Saved to the selected blockchain anthology",
        variant: "success",
        delay: 5000,
      });

      setShow(false);
    } catch (error) {
      console.error("Error copying/moving memoir:", error);
      addToast({
        title: "Something went wrong",
        content: "The memoir could not be copied or moved.",
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={() => setShow(false)}
      trigger={
        <span
          title="Copy/Move to another anthology"
          style={{ cursor: "pointer", fontSize: "1rem" }}
          onClick={() => setShow(true)}
        >
          <img
            src="/icons/copy-clipboard-icon.svg"
            alt="Copy or move memoir"
            style={{ width: "18px", height: "18px", display: "block" }}
          />
        </span>
      }
    >
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
        <h4 style={{ textAlign: "center", margin: 0 }}>Copy / Move Memoir</h4>

        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}>
          <ContractSelector
            setSelectedContract={setDestination}
            variant="light"
            showUserSelect={false}
          />
        </div>

        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
        >
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
            Copy
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
            Move
          </label>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!destination || isSubmitting}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "0.95rem",
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            cursor: destination && !isSubmitting ? "pointer" : "not-allowed",
            opacity: destination && !isSubmitting ? 1 : 0.6,
          }}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "move"
            ? "Move Memoir"
            : "Copy Memoir"}
        </button>
      </div>
    </Modal>
  );
};
