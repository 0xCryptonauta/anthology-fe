import { useState } from "react";
import "./style.css";
import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { writeFactory } from "@src/contract-functions/factoryFunctions";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { useAccount } from "wagmi";
import { addUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";
import { Modal } from "@src/components/Layout/Modal";
import { TitleEditor } from "@components/Factory/TitleEditor";
import { MemoirContent } from "@src/types/common";

interface DeployButtonProps {
  isLocal?: boolean;
  userTitles?: MemoirContent[];
}

export const DeployButton: React.FC<DeployButtonProps> = ({
  isLocal = false,
  userTitles,
}) => {

  const { userAddr } = useAppSelector((state) => state.user || "");
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.factory || ""
  );
  const { whitelistedUsers } = useAppSelector((state) => state.factory || []);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { isConnected } = useAccount();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const canCreateOnChain =
    isConnected &&
    (!whitelistEnabled ||
      whitelistedUsers.includes(userAddr) ||
      owner === userAddr);

  const handleDeploy = async (combinedTitle: string) => {
    if (isLocal || !canCreateOnChain) {
      const localContract = generateLocalContractAddr();
      dispatch(
        addUserLocalAnthology({
          user: LOCAL_USER_ADDR,
          contract: localContract,
          title: combinedTitle,
        })
      );
      addToast({
        title: "New Anthology was created",
        content: localContract,
        variant: "success",
        delay: 5000,
      });
      handleClose();
    } else {
      const txHash = await writeFactory("deployAnthology");
      if (txHash) {
        addToast({
          title: "New Anthology was created",
          content: "TxHash: " + txHash,
          variant: "success",
          delay: 5000,
        });
        handleClose();
      }
    }
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={
        isLocal || canCreateOnChain ? (
          <span
            className="btn-new-pill"
            onClick={() => setShow(true)}
            aria-label="New Anthology"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        ) : (
          <></>
        )
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
          New Anthology
        </span>

        <TitleEditor
          userTitles={userTitles}
          submitLabel={isLocal || !canCreateOnChain ? "Add Private Anthology" : "Add Public Anthology"}
          onSubmit={handleDeploy}
        />
      </div>
    </Modal>
  );
};
