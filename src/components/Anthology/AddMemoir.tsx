import { useState } from "react";
import { writeAnthology } from "../../contract-functions/AnthologyFunctions";
import { Offcanvas } from "react-bootstrap";
import "./style.css";
import { useToast } from "../Toast";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const AddMemoir = ({ contractAddr }: { contractAddr: string }) => {
  const [anthologyTitle, setAnthologyTitle] = useState("");
  const [anthologyContent, setAnthologyContent] = useState("");

  const [show, setShow] = useState(false);

  const { userAddr } = useSelector((state: RootState) => state.user || "");
  const { whitelistEnabled, owner } = useSelector(
    (state: RootState) => state.anthology[contractAddr]?.anthologyState || ""
  );
  const whitelist = useSelector(
    (state: RootState) => state.anthology[contractAddr]?.whitelist
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToast();

  return (
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
          placement="bottom"
          style={{ height: "350px", backgroundColor: "none !important" }}
        >
          {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add new memoir</Offcanvas.Title>
        </Offcanvas.Header> */}
          <Offcanvas.Body
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
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
              <button
                style={{ marginTop: "15px" }}
                onClick={async () => {
                  const txHash_setTitle = await writeAnthology(
                    contractAddr,
                    "createMemoir",
                    [anthologyTitle, anthologyContent]
                  );
                  console.log("txHash created", txHash_setTitle);
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
