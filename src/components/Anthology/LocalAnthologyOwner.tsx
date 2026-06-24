import { useState, useMemo } from "react";
import { useToast } from "@components/Layout/Toast";

import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { Address, MemoirContent } from "@src/types/common";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateUserLocalAnthologyTitle } from "@src/store/slices/localAnthologySlice";

import { ChangeAnthologyDefaultSkin } from "./ChangeAnthologyDefaultSkin";
import { TitleEditor } from "@components/Factory/TitleEditor";
import { Modal } from "@src/components/Layout/Modal";

export const LocalAnthologyOwner = ({
  contractAddr,
}: {
  contractAddr: Address;
}) => {
  const { addToast } = useToast();

  const { contractsTitles, userContracts } = useAppSelector((state) => state.localAnthology);

  const currentTitle = contractsTitles[contractAddr] || "";

  const dispatch = useAppDispatch();

  const [showTitleModal, setShowTitleModal] = useState(false);

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
            width: "320px",
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

      {/* <div style={{ marginTop: "20px" }}>
        <button
          style={{ backgroundColor: "red" }}
          onClick={async () => {
            try {
              
              if (txHash) {
                addToast({
                  title: "Cleaning memoirs",
                  content: "txHash: " + txHash,
                  variant: "success",
                  delay: 5000,
                });
              }
            } catch (error) {
              addToast({
                title: "Error cleaning memoirs",
                content: "Unknown error",
                variant: "warning",
                delay: 5000,
              });
              console.error("Error cleaning memoirs", error);
            }
          }}
        >
          Clean Memoirs
        </button>
      </div> */}
    </div>
  );
};
