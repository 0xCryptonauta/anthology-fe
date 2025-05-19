import { updateFactoryRpc } from "@src/store/slices/dappSlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { isValidRpc } from "@src/utils/isValidRpc";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useToast } from "./Toast";

export const NetworkSettings = () => {
  const { factoryRpc } = useAppSelector((state) => state.dapp);

  const { addToast } = useToast();

  const dispatch = useAppDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [newFactoryRpc, setNewFactoryRpc] = useState(factoryRpc);

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      {!show ? (
        <div onClick={handleShow} style={{ cursor: "pointer" }}>
          Network Settings
        </div>
      ) : (
        <Offcanvas
          show={show}
          onHide={handleClose}
          onClick={handleClose}
          placement="bottom"
          style={{ height: "350px", backgroundColor: "transparent" }}
        >
          {/*           <Offcanvas.Header closeButton>
            <Offcanvas.Title>Network Settings</Offcanvas.Title>
          </Offcanvas.Header> */}
          <Offcanvas.Body
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                backgroundColor: "#222222",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid black",
                padding: "5px",
                borderRadius: "7px",
                margin: "3px",
                width: "300px",
                height: "400px",
              }}
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
                  <span style={{ marginBottom: "10px" }}>Set new RPC</span>
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
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};
