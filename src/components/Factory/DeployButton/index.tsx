import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import "./style.css";
import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { writeFactory } from "@src/contract-functions/factoryFunctions";
import { LOCAL_USER_ADDR, MAX_TITLE_LENGTH } from "@src/utils/constants";
import { useAccount } from "wagmi";
import { addUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { generateLocalContractAddr } from "@src/utils/generateLocalContractAddr";

interface CheckboxChangeEvent {
  target: {
    checked: boolean;
  };
}

export const DeployButton = () => {
  const [anthologyTitle, setAnthologyTitle] = useState("");
  const [show, setShow] = useState(false);
  const { userAddr } = useAppSelector((state) => state.user || "");
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.factory || ""
  );
  const { whitelistedUsers } = useAppSelector((state) => state.factory || []);

  const dispatch = useAppDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToast();

  const { isConnected } = useAccount();

  const [localChecked, setLocalChecked] = useState(true);
  const [blockchainChecked, setBlockchainChecked] = useState(false);

  const handleLocalChange = (e: CheckboxChangeEvent) => {
    setLocalChecked(e.target.checked);
    if (e.target.checked) {
      setBlockchainChecked(false);
    }
  };

  const handleBlockchainChange = (e: CheckboxChangeEvent): void => {
    setBlockchainChecked(e.target.checked);
    if (e.target.checked) {
      setLocalChecked(false);
    }
  };

  return (
    <>
      <span
        onClick={handleShow}
        style={{ marginLeft: "10px", fontSize: "20px", cursor: "pointer" }}
      >
        🆕
      </span>
      <Offcanvas
        show={show}
        onHide={handleClose}
        onClick={handleClose}
        placement={window.innerHeight > window.innerWidth ? "top" : "bottom"}
        //className="bg-dark"
        style={{
          height: "390px",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add new memoir</Offcanvas.Title>
        </Offcanvas.Header> */}
        <Offcanvas.Body
          //onClick={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "transparent !important",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              border: "1px solid black",
              padding: "5px",
              borderRadius: "7px",
              margin: "3px",
              maxWidth: "300px",
              //width: "fit-content",
            }}
          >
            <span>New Anthology Title:</span>
            <textarea
              value={anthologyTitle}
              placeholder="[Category][Subcategory]Title"
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
              maxLength={MAX_TITLE_LENGTH}
              onChange={(event) => {
                setAnthologyTitle(event.target.value);
              }}
            ></textarea>
            <br />

            {isConnected ? (
              !whitelistEnabled ||
              whitelistedUsers.includes(userAddr) ||
              owner === userAddr ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={localChecked}
                        onChange={handleLocalChange}
                      />{" "}
                      Local
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={blockchainChecked}
                        onChange={handleBlockchainChange}
                      />{" "}
                      Blockchain
                    </label>
                  </div>
                  <br />
                  {blockchainChecked ? (
                    <div>
                      <button
                        className="btn-rocket"
                        onClick={async () => {
                          const txHash = await writeFactory("deployAnthology"); // can add title here as argument
                          console.log("txHash: ", txHash);
                          if (txHash) {
                            addToast({
                              title: "New Anthology was created",
                              content: "TxHash: " + txHash,
                              variant: "success",
                              delay: 5000,
                            });
                          }
                        }}
                      >
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
                        <span> Deploy Anthology</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-rocket"
                      onClick={async () => {
                        dispatch(
                          addUserLocalAnthology({
                            user: LOCAL_USER_ADDR,
                            contract: generateLocalContractAddr(),
                            title: anthologyTitle,
                          })
                        );
                        addToast({
                          title: "New Anthology was created",
                          content: "TxHash: ",
                          variant: "success",
                          delay: 5000,
                        });
                      }}
                    >
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
                      <span> Draft Anthology</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="btn-rocket"
                  onClick={async () => {
                    dispatch(
                      addUserLocalAnthology({
                        user: LOCAL_USER_ADDR,
                        contract: generateLocalContractAddr(),
                        title: anthologyTitle,
                      })
                    );
                    addToast({
                      title: "New Anthology was created",
                      content: "TxHash: ",
                      variant: "success",
                      delay: 5000,
                    });
                  }}
                >
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
                  <span style={{ color: "#FF8383" }}> Draft Anthology</span>
                </button>
              )
            ) : (
              <button
                className="btn-rocket"
                onClick={async () => {
                  dispatch(
                    addUserLocalAnthology({
                      user: LOCAL_USER_ADDR,
                      contract: generateLocalContractAddr(),
                      title: anthologyTitle,
                    })
                  );
                  addToast({
                    title: "New Anthology was created",
                    content: "TxHash: ",
                    variant: "success",
                    delay: 5000,
                  });
                }}
              >
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
                <span style={{ color: "#FF8383" }}> Draft Anthology</span>
              </button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
