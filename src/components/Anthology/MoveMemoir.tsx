import { useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import {
  addMemoirToUserLocalAnthology,
  deleteMemoirAtIndexFromUserLocalAnthology,
} from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";

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

  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const localUserContracts = useAppSelector(
    (s) => s.localAnthology.userContracts[LOCAL_USER_ADDR] || []
  );
  const titles = useAppSelector((s) => s.localAnthology.contractsTitles);

  const destinations = localUserContracts.filter(
    (addr) => addr !== anthologyAddr
  );

  const handleConfirm = () => {
    if (!destination) return;

    dispatch(
      addMemoirToUserLocalAnthology({
        contract: destination,
        memoir: { ...memoir },
      })
    );

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
      content: `Saved to "${titles[destination] || destination}"`,
      variant: "success",
      delay: 5000,
    });

    setShow(false);
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
          🗂️
        </span>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <h4 style={{ textAlign: "center", margin: 0 }}>Copy / Move Memoir</h4>

        {destinations.length === 0 ? (
          <span style={{ textAlign: "center", fontSize: "14px" }}>
            You need another local anthology to copy or move memoirs into.
          </span>
        ) : (
          <>
            <label style={{ fontWeight: 500 }}>Destination anthology</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value as Address)}
              style={{
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
              }}
            >
              <option value="">Select anthology</option>
              {destinations.map((addr) => (
                <option key={addr} value={addr}>
                  {titles[addr] || addr}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
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
              disabled={!destination}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "0.75rem",
                fontWeight: 600,
                fontSize: "0.95rem",
                backgroundColor: "#111827",
                color: "#fff",
                border: "none",
                cursor: destination ? "pointer" : "not-allowed",
                opacity: destination ? 1 : 0.6,
              }}
            >
              {mode === "move" ? "Move Memoir" : "Copy Memoir"}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};
