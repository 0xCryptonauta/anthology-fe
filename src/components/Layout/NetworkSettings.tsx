import { updateFactoryRpc } from "@src/store/slices/dappSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { isValidRpc } from "@src/utils/isValidRpc";
import { useState } from "react";
import { useToast } from "./Toast";
import { useAccount } from "wagmi";
import { Modal } from "./Modal";

export const NetworkSettings = () => {
  const { factoryRpc } = useAppSelector((state) => state.dapp);

  const { isConnected } = useAccount();

  const { addToast } = useToast();

  const dispatch = useAppDispatch();

  const [newFactoryRpc, setNewFactoryRpc] = useState(factoryRpc);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const handleRpcChange = async () => {
    const isValid = await isValidRpc(newFactoryRpc);

    if (isValid && factoryRpc !== newFactoryRpc) {
      dispatch(updateFactoryRpc(newFactoryRpc));
      console.log("New RPC Added");

      if (newFactoryRpc === "") {
        addToast({
          title: "RPC changed to:",
          content: `default RPC`,
          variant: "success",
          delay: 5000,
        });
      } else {
        addToast({
          title: "RPC changed to:",
          content: `${newFactoryRpc}`,
          variant: "success",
          delay: 5000,
        });
      }
      handleClose();
    } else {
      addToast({
        title: "Error changing RPC",
        content: "Invalid RPC URL",
        variant: "danger",
        delay: 5000,
      });
    }
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={
        isConnected ? (
          <span
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "10px 16px",
              borderRadius: "8px",
              display: "inline-block",
              fontSize: "14px",
              fontWeight: "bold",
              backgroundColor: "#f7fafc",
              color: "#2b6cb0",
            }}
            onClick={() => setShow(true)}
          >
            Network Settings
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
          justifyContent: "space-around",
          //border: "1px solid white",
          color: "white",
          width: "fit-content",
          padding: "7px",
          borderRadius: "7px",
          margin: "5px",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span style={{ marginBottom: "10px", color: "black" }}>
            Set new RPC
          </span>
          <textarea
            value={newFactoryRpc}
            placeholder="https://..."
            style={{
              height: "120px",
              minHeight: "120px",
              maxHeight: "150px",
              //backgroundColor: "white",
              color: "white",
              borderRadius: "5px",
              width: "220px",
              textAlign: "center",
              alignContent: "center",
            }}
            maxLength={255}
            onChange={(event) => {
              setNewFactoryRpc(event.target.value);
            }}
          ></textarea>
        </div>
        <button
          style={{ margin: "10px 0px", cursor: "pointer" }}
          onClick={async () => {
            handleRpcChange();
          }}
        >
          Update RPC 🔄
        </button>
      </div>
    </Modal>
  );
};
