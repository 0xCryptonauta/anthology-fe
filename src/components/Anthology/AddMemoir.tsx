import { useState } from "react";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { Offcanvas } from "react-bootstrap";
import "./style.css";
import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { Address } from "@src/types/common";
//import { addUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { ShouldAddToBlockchain } from "../Layout/ShouldAddToBlockchain";
import { addMemoirToUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { LOCAL_USER_ADDR } from "@src/utils/constants";

export const AddMemoir = ({
  contractAddr,
  title = "",
  content = "",
}: {
  contractAddr: Address;
  title?: string;
  content?: string;
}) => {
  const [anthologyTitle, setAnthologyTitle] = useState(title);
  const [anthologyContent, setAnthologyContent] = useState(content);

  const [show, setShow] = useState(false);

  const { userAddr } = useAppSelector((state) => state.user || "");
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.anthology[contractAddr]?.anthologyState || ""
  );
  const whitelist = useAppSelector(
    (state) => state.anthology[contractAddr]?.whitelist
  );

  const { shouldAddToBlockchain } = useAppSelector((state) => state.dapp);

  const dispatch = useAppDispatch();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToast();

  return (
    userAddr &&
    (!whitelistEnabled ||
      whitelist.includes(userAddr) ||
      owner === userAddr) && (
      <>
        <span onClick={handleShow} className="addMemoirButton">
          📝
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
              <span>Title:</span>
              <input
                placeholder=""
                value={anthologyTitle}
                maxLength={50}
                onChange={(e) => {
                  setAnthologyTitle(e.target.value);
                }}
              ></input>
              <br />
              <span>Content:</span>
              <textarea
                value={anthologyContent}
                style={{ height: "100px" }}
                maxLength={255}
                onChange={(e) => {
                  setAnthologyContent(e.target.value);
                }}
              ></textarea>

              <ShouldAddToBlockchain />

              <button
                style={{ marginTop: "15px" }}
                onClick={async () => {
                  if (shouldAddToBlockchain) {
                    const txHash_setTitle = await writeAnthology(
                      contractAddr,
                      "createMemoir",
                      [anthologyTitle, anthologyContent]
                    );
                    if (txHash_setTitle) {
                      setAnthologyContent("");
                      setAnthologyTitle("");
                      addToast({
                        title: "Memoir Added",
                        content: "TxHash: " + txHash_setTitle,
                        variant: "success",
                        delay: 5000,
                      });
                    }
                  } else {
                    dispatch(
                      addMemoirToUserLocalAnthology({
                        contract: contractAddr,
                        memoir: {
                          sender: LOCAL_USER_ADDR,
                          title: anthologyTitle,
                          content: anthologyContent,
                          timestamp: String(
                            Math.floor(new Date().getTime() / 1000)
                          ),
                        },
                      })
                    );
                    setAnthologyContent("");
                    setAnthologyTitle("");
                    addToast({
                      title: "Memoir Added",
                      content: "Memoir added locally, not on blockchain yet",
                      variant: "success",
                      delay: 5000,
                    });
                  }
                  handleClose();
                }}
              >
                Add Memoir
              </button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    )
  );
};
