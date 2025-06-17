import { useEffect, useRef, useState } from "react";

import { Offcanvas } from "react-bootstrap";

import { useToast } from "@components/Layout/Toast";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { isAddress } from "viem";
import {
  updateOneContractTitle,
  updateUserContracts,
  updateUsers,
} from "@src/store/slices/factorySlice";
import { Address } from "@src/types/common";
import { readFactory } from "@src/contract-functions/factoryFunctions";
import {
  addAnthology,
  AnthologyInfoInterface,
} from "@src/store/slices/anthologySlice";
import { readAnthology } from "@src/contract-functions/anthologyFunctions";
import QRScanner from "./QRScanner";
import { isQrReturnValid } from "@src/utils/isQrReturnValid";

//import { useNavigate } from "react-router-dom";

const searchOptions = [
  "Anthology Address",
  //"User Address"
];

export const AddToDiscover = () => {
  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();
  //const navigate = useNavigate();

  const { users, contractsTitles } = useAppSelector((state) => state.factory);

  const [addressToAdd, setAddressToAdd] = useState("");
  const [selectedSearchOption, setSelectedSearchOption] = useState(
    searchOptions[0]
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToast();

  const offcanvasRef = useRef<HTMLDivElement>(null);

  const mouseDownRef = useRef(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current =
        !!offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const selection = window.getSelection();
      const isSelectingText =
        selection &&
        selection.type === "Range" &&
        selection.toString().length > 0;

      if (
        mouseDownRef.current &&
        !isSelectingText &&
        offcanvasRef.current &&
        !offcanvasRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
      mouseDownRef.current = false;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    if (!textarea || !overlay) return;

    const handleScroll = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener("scroll", handleScroll);
    return () => textarea.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <span onClick={handleShow} className="addMemoirButton">
        🕵🏻‍♂️
      </span>
      <Offcanvas
        show={show}
        onHide={handleClose}
        //onClick={handleClose}
        placement={window.innerHeight > window.innerWidth ? "top" : "bottom"}
        //className="bg-dark"
        style={{
          height: "450px",
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
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
            ref={offcanvasRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              border: "1px solid black",
              padding: "10px",
              borderRadius: "7px",
              margin: "3px",
              maxWidth: "300px",
              //width: "fit-content",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  display: "inline-block",
                }}
              >
                Discover
              </span>
            </div>
            <div style={{ position: "absolute", top: "10px", right: "10px" }}>
              <QRScanner
                onScan={(qrReturn) => {
                  if (!isQrReturnValid(qrReturn)) {
                    addToast({
                      title: "Invalid QR Code",
                      content: "Please scan a valid QR Code.",
                      variant: "info",
                      delay: 3000,
                    });
                    return;
                  }
                  const { type, address } = JSON.parse(qrReturn);
                  if (type === "anthology") {
                    if (!isAddress(address)) {
                      addToast({
                        title: "Invalid Anthology Address",
                        content: "Please scan a valid Anthology address.",
                        variant: "info",
                        delay: 3000,
                      });
                      return;
                    }
                    setAddressToAdd(address);
                    setSelectedSearchOption("Anthology Address");
                  } else if (type === "user") {
                    if (!isAddress(address)) {
                      addToast({
                        title: "Invalid User Address",
                        content: "Please scan a valid User address.",
                        variant: "info",
                        delay: 3000,
                      });
                      return;
                    }
                    setAddressToAdd(address);
                    setSelectedSearchOption("User Address");
                  } else {
                    addToast({
                      title: "Unknown QR Code Type",
                      content: "The scanned QR Code is not recognized.",
                      variant: "info",
                      delay: 3000,
                    });
                    return;
                  }
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="text"
                  placeholder="Anthology/User Addr"
                  value={addressToAdd}
                  onChange={(event) => setAddressToAdd(event.target.value)}
                  autoComplete="new-password"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    padding: "10px 14px",
                    fontSize: "16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "10px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#6366f1")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#d1d5db")
                  }
                />
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <select
                value={selectedSearchOption}
                onChange={(event) =>
                  setSelectedSearchOption(event.target.value)
                }
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  backgroundColor: "#f9fafb",
                  color: "#111827",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: "pointer",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              >
                {searchOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  transition: "background-color 0.2s ease, transform 0.1s ease",
                }}
                onClick={async () => {
                  if (!isAddress(addressToAdd)) {
                    addToast({
                      title: "Enter address",
                      content: "Please enter a valid address",
                      variant: "info",
                      delay: 3000,
                    });
                    return;
                  }
                  if (selectedSearchOption === "User Address") {
                    if (!users.includes(addressToAdd as Address)) {
                      const contracts = (await readFactory("userContracts", [
                        addressToAdd,
                        0,
                      ])) as Address[];

                      if (contracts !== undefined) {
                        dispatch(updateUsers([addressToAdd]));
                        addToast({
                          title: "User found",
                          content: `User ${addressToAdd} has been added successfully.`,
                          variant: "success",
                          delay: 3000,
                        });
                      } else {
                        addToast({
                          title: "User not found",
                          content: `No user found with address ${addressToAdd}.`,
                          variant: "info",
                          delay: 3000,
                        });
                      }
                    } else {
                      addToast({
                        title: "User already in directory",
                        content: `User: ${addressToAdd} is already in the directory.`,
                        variant: "info",
                        delay: 3000,
                      });
                    }
                  } else if (selectedSearchOption === "Anthology Address") {
                    if (!contractsTitles[addressToAdd as Address]) {
                      const anthologyInfo = (await readAnthology(
                        addressToAdd as Address,
                        "getAnthologyInfo"
                      )) as AnthologyInfoInterface;
                      if (anthologyInfo !== undefined) {
                        dispatch(updateUsers([anthologyInfo.owner]));
                        dispatch(
                          updateUserContracts({
                            [anthologyInfo.owner]: [addressToAdd as Address],
                          })
                        );
                        dispatch(
                          updateOneContractTitle({
                            contract: addressToAdd as Address,
                            title: anthologyInfo.title,
                          })
                        );
                        dispatch(
                          addAnthology({
                            contract: anthologyInfo.owner,
                            anthologyInfo: {
                              ...anthologyInfo,
                              totalCreatedMemoirs: Number(
                                anthologyInfo.totalCreatedMemoirs
                              ),
                              currentMemoirCount: Number(
                                anthologyInfo.currentMemoirCount
                              ),
                              maxMemoirs: Number(anthologyInfo.maxMemoirs),
                              memoirPrice: Number(anthologyInfo.memoirPrice),
                              memoirsCP: Number(anthologyInfo.memoirsCP),
                              memoirBufferCP: Number(
                                anthologyInfo.memoirBufferCP
                              ),
                              whitelistCP: Number(anthologyInfo.whitelistCP),
                            },
                          })
                        );
                        addToast({
                          title: "Anthology found",
                          content: `Anthology ${addressToAdd} has been added successfully.`,
                          variant: "success",
                          delay: 3000,
                        });
                      } else {
                        addToast({
                          title: "Anthology not found",
                          content: `No anthology found with address ${addressToAdd}.`,
                          variant: "info",
                          delay: 3000,
                        });
                      }
                    } else {
                      addToast({
                        title: "Anthology already in directory",
                        content: `Anthology: ${addressToAdd} is already in the directory.`,
                        variant: "info",
                        delay: 3000,
                      });
                    }
                  }
                  setAddressToAdd("");
                  handleClose();
                }}
              >
                Add
              </button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
