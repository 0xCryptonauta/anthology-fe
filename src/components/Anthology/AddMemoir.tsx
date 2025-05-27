import { useState } from "react";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { Offcanvas } from "react-bootstrap";
import "./style.css";
import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { Address } from "@src/types/common";
import { addMemoirToUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { removeSocialTracking } from "@src/utils/removeSocialTracking";
import { HighlightDifferences } from "../Layout/HighlightDifferences";

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
  const [shouldFilterTracking, setShouldFilterTracking] = useState(true);

  const { userAddr, currentPath } = useAppSelector((state) => state.user);
  const { whitelistEnabled, owner } = useAppSelector(
    (state) => state.anthology[contractAddr]?.anthologyState || ""
  );
  const whitelist = useAppSelector(
    (state) => state.anthology[contractAddr]?.whitelist
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToast();

  const filteredContent = shouldFilterTracking
    ? removeSocialTracking(anthologyContent)
    : anthologyContent;

  return (
    (!whitelistEnabled ||
      whitelist.includes(userAddr) ||
      userAddr === owner) && (
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
                style={{ backgroundColor: "white", color: "black" }}
                onChange={(e) => {
                  setAnthologyTitle(e.target.value);
                }}
              ></input>
              <br />
              <span>Content:</span>
              <div style={{ position: "relative", width: "100%" }}>
                {/* Overlay with highlighted diffs */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "transparent",
                    fontSize: "0.875rem", // = 14px if root is 16px
                    fontFamily: "monospace", // or your custom font
                    lineHeight: "1.5",
                    padding: "0.6rem", // = 8px
                    boxSizing: "border-box",
                  }}
                  aria-hidden="true"
                >
                  {HighlightDifferences(anthologyContent, filteredContent)}
                </div>

                {/* Underlying textarea */}
                <textarea
                  value={
                    shouldFilterTracking ? filteredContent : anthologyContent
                  }
                  maxLength={255}
                  onChange={(e) => setAnthologyContent(e.target.value)}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    minHeight: "7rem", // 48px
                    maxHeight: "12.5rem", // 200px
                    overflowY: "auto",
                    resize: "none",
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    fontFamily: "monospace", // match overlay exactly
                    lineHeight: "1.5",
                    color: "black",
                    backgroundColor: "transparent",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="checkbox"
                  checked={shouldFilterTracking}
                  onChange={() =>
                    setShouldFilterTracking(!shouldFilterTracking)
                  }
                ></input>
                <span
                  style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  onClick={() => setShouldFilterTracking(!shouldFilterTracking)}
                >
                  Remove Tracking from URL
                </span>
              </div>

              <button
                style={{ marginTop: "15px" }}
                onClick={async () => {
                  if (isLocalAnthology(contractAddr)) {
                    dispatch(
                      addMemoirToUserLocalAnthology({
                        contract: contractAddr,
                        memoir: {
                          sender: LOCAL_USER_ADDR,
                          title: anthologyTitle,
                          content: filteredContent,
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
                  } else {
                    const txHash_setTitle = await writeAnthology(
                      contractAddr,
                      "createMemoir",
                      [anthologyTitle, filteredContent]
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
                  }
                  if (currentPath !== `contract/${contractAddr}`) {
                    dispatch(updateCurrentPath(`contract/${contractAddr}`));
                    navigate("/");
                    console.log("GO.");
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
