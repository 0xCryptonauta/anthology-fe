import { useState } from "react";
import "./style.css";
import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { writeFactory } from "@src/contract-functions/factoryFunctions";
import { LOCAL_USER_ADDR, MAX_TITLE_LENGTH } from "@src/utils/constants";
import { useAccount } from "wagmi";
import { addUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";
import { Modal } from "@src/components/Layout/Modal";
interface DeployButtonProps {
  isLocal?: boolean;
}

export const DeployButton: React.FC<DeployButtonProps> = ({
  isLocal = false,
}) => {
  const [anthologyTitle, setAnthologyTitle] = useState("");

  const { userAddr } = useAppSelector((state) => state.user || "");
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.factory || ""
  );
  const { whitelistedUsers } = useAppSelector((state) => state.factory || []);
  console.log(isLocal);

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

  const handleDeploy = async () => {
    if (isLocal || !canCreateOnChain) {
      const localContract = generateLocalContractAddr();
      dispatch(
        addUserLocalAnthology({
          user: LOCAL_USER_ADDR,
          contract: localContract,
          title: anthologyTitle,
        })
      );
      addToast({
        title: "New Anthology was created",
        content: localContract,
        variant: "success",
        delay: 5000,
      });
      setAnthologyTitle("");
      handleClose();
    } else {
      const txHash = await writeFactory("deployAnthology");
      console.log("txHash: ", txHash);
      if (txHash) {
        addToast({
          title: "New Anthology was created",
          content: "TxHash: " + txHash,
          variant: "success",
          delay: 5000,
        });
        setAnthologyTitle("");
        handleClose();
      }
    }
  };

  const ButtonContent = (
    <>
      <svg
        height="24"
        width="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path
          d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
          fill="currentColor"
        ></path>
      </svg>
      <span
        style={
          !canCreateOnChain || isLocal
            ? { color: "#FF8383", marginLeft: "10px" }
            : undefined
        }
      >
        {isLocal || !canCreateOnChain
          ? " Draft Anthology"
          : " Deploy Anthology"}
      </span>
    </>
  );

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={
        isLocal || canCreateOnChain ? (
          <span
            style={{ marginLeft: "10px", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setShow(true)}
          >
            🆕
          </span>
        ) : (
          <></>
        )
      }
    >
      <span
        style={{
          color: "black",
          margin: "10px 0px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        New Anthology Title:
      </span>
      <textarea
        value={anthologyTitle}
        placeholder="[Category][Subcat]Title"
        style={{
          height: "120px",
          minHeight: "120px",
          maxHeight: "150px",
          color: "white",
          borderRadius: "5px",
          width: "220px",
          textAlign: "center",
          alignContent: "center",
        }}
        maxLength={MAX_TITLE_LENGTH}
        onChange={(event) => {
          setAnthologyTitle(event.target.value);
        }}
      ></textarea>
      <br />
      <button className="btn-rocket" onClick={handleDeploy}>
        {ButtonContent}
      </button>
      <br />
    </Modal>
  );
};
