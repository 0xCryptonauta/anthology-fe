import { useState } from "react";
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
import { Modal } from "./Modal";

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

  const { addToast } = useToast();
  const showToast = (
    title: string,
    content: string,
    variant?: "success" | "info"
  ) => addToast({ title, content, variant: variant ?? "info", delay: 3000 });

  const onScan = (qrReturn: string) => {
    if (!isQrReturnValid(qrReturn)) {
      return showToast("Invalid QR Code", "Please scan a valid QR Code.");
    }

    const { type, address } = JSON.parse(qrReturn);

    if (!isAddress(address)) {
      return showToast(
        type === "user" ? "Invalid User Address" : "Invalid Anthology Address",
        `Please scan a valid ${type === "user" ? "User" : "Anthology"} address.`
      );
    }

    if (type === "user" || type === "anthology") {
      setAddressToAdd(address);
      setSelectedSearchOption(
        type === "user" ? "User Address" : "Anthology Address"
      );
    } else {
      showToast(
        "Unknown QR Code Type",
        "The scanned QR Code is not recognized."
      );
    }
  };

  const addDiscovery = async () => {
    if (!isAddress(addressToAdd)) {
      return addToast({
        title: "Enter address",
        content: "Please enter a valid address",
        variant: "info",
        delay: 3000,
      });
    }

    const address = addressToAdd as Address;

    if (selectedSearchOption === "User Address") {
      if (users.includes(address)) {
        showToast(
          "User already in directory",
          `User: ${address} is already in the directory.`,
          "info"
        );
      } else {
        const contracts = (await readFactory("userContracts", [
          address,
          0,
        ])) as Address[];
        if (contracts !== undefined) {
          dispatch(updateUsers([address]));
          showToast(
            "User found",
            `User ${address} has been added successfully.`,
            "success"
          );
        } else {
          showToast(
            "User not found",
            `No user found with address ${address}.`,
            "info"
          );
        }
      }
    }

    if (selectedSearchOption === "Anthology Address") {
      if (contractsTitles[address]) {
        showToast(
          "Anthology already in directory",
          `Anthology: ${address} is already in the directory.`,
          "info"
        );
      } else {
        const info = (await readAnthology(
          address,
          "getAnthologyInfo"
        )) as AnthologyInfoInterface;
        if (info !== undefined) {
          dispatch(updateUsers([info.owner]));
          dispatch(updateUserContracts({ [info.owner]: [address] }));
          dispatch(
            updateOneContractTitle({ contract: address, title: info.title })
          );
          dispatch(
            addAnthology({
              contract: info.owner,
              anthologyInfo: {
                ...info,
                totalCreatedMemoirs: Number(info.totalCreatedMemoirs),
                currentMemoirCount: Number(info.currentMemoirCount),
                maxMemoirs: Number(info.maxMemoirs),
                memoirPrice: Number(info.memoirPrice),
                memoirsCP: Number(info.memoirsCP),
                memoirBufferCP: Number(info.memoirBufferCP),
                whitelistCP: Number(info.whitelistCP),
              },
            })
          );
          showToast(
            "Anthology found",
            `Anthology ${address} has been added successfully.`,
            "success"
          );
        } else {
          showToast(
            "Anthology not found",
            `No anthology found with address ${address}.`,
            "info"
          );
        }
      }
    }

    setAddressToAdd("");
    handleClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        trigger={
          <span onClick={() => setShow(true)} className="addMemoirButton">
            🕵🏻‍♂️
          </span>
        }
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ position: "absolute", right: 0, top: 1 }}>
            <QRScanner onScan={onScan} />
          </div>
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
              onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
            />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <select
            value={selectedSearchOption}
            onChange={(event) => setSelectedSearchOption(event.target.value)}
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
            onClick={addDiscovery}
          >
            Add
          </button>
        </div>
      </Modal>
    </>
  );
};
