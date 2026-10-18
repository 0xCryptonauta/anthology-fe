import { useState, useMemo } from "react";
import { useToast } from "@components/Layout/Toast";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { Address, MemoirContent } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import {
  clearMemoirsInUserLocalAnthology,
  updateUserLocalAnthologyTitle,
} from "@src/store/slices/localAnthologySlice";

import { ChangeAnthologyDefaultSkin } from "./ChangeAnthologyDefaultSkin";
import { TitleEditor } from "@components/Factory/TitleEditor";
import { Modal } from "@src/components/Layout/Modal";

export const LocalAnthologyOwner = ({
  contractAddr,
}: {
  contractAddr: Address;
}) => {
  const { addToast } = useToast();

  const { contractsTitles, userContracts, anthologies } = useAppSelector(
    (state) => state.localAnthology
  );

  const currentTitle = contractsTitles[contractAddr] || "";
  const memoirCount = anthologies[contractAddr]?.length ?? 0;

  const dispatch = useAppDispatch();

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);

  const userTitles: MemoirContent[] = useMemo(() => {
    const contracts = userContracts?.[LOCAL_USER_ADDR] || [];
    return contracts.map((addr, i) => ({
      address: addr,
      title: contractsTitles[addr] || "",
      originalIndex: i,
    }));
  }, [userContracts, contractsTitles]);
  const handleCloseTitleModal = () => setShowTitleModal(false);

  const handleTitleSubmit = (combinedTitle: string) => {
    try {
      addToast({
        title: "New title:",
        content: combinedTitle,
        variant: "success",
        delay: 5000,
      });
      dispatch(
        updateUserLocalAnthologyTitle({
          contract: contractAddr,
          newTitle: combinedTitle,
        })
      );
      handleCloseTitleModal();
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

  const handleCleanMemoirs = () => {
    dispatch(clearMemoirsInUserLocalAnthology({ contract: contractAddr }));
    addToast({
      title: "Memoirs deleted",
      content: "All memoirs in this anthology were deleted.",
      variant: "success",
      delay: 5000,
    });
    setShowCleanModal(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "20px 5px",
      }}
    >
      <br />
      {/* ------------------------------- Update Anthology title ------------------------------ */}
      <Modal
        placement="bottom"
        show={showTitleModal}
        onHide={handleCloseTitleModal}
        trigger={
          <button
            style={{
              marginTop: "10px",
              backgroundColor: "dodgerblue",
              border: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9rem",
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
            initialTitle={currentTitle}
            userTitles={userTitles}
            submitLabel="Change title"
            onSubmit={handleTitleSubmit}
          />
        </div>
      </Modal>
      <br />
      <ChangeAnthologyDefaultSkin contractAddr={contractAddr} />

      {/* ----------------------------------- cleanMemoirs ------------------------------------ */}
      {memoirCount > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Modal
            placement="bottom"
            show={showCleanModal}
            onHide={() => setShowCleanModal(false)}
            trigger={
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
                onClick={() => setShowCleanModal(true)}
              >
                Delete all memoirs
              </button>
            }
          >
            <div
              style={{
                margin: "30px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                color: "#1a1a1a",
              }}
            >
              <span style={{ fontWeight: "bold", textAlign: "center" }}>
                Delete all memoirs in this anthology?
              </span>
              <span style={{ textAlign: "center" }}>
                All {memoirCount} memoir{memoirCount === 1 ? "" : "s"} in{" "}
                <strong>{currentTitle || "this anthology"}</strong> will be
                deleted. The anthology itself will remain. This action cannot be
                undone.
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
                onClick={() => setShowCleanModal(false)}
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
                onClick={handleCleanMemoirs}
              >
                Delete all memoirs
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};
