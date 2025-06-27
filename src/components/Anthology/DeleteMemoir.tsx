import { useState } from "react";
import "./style.css";
import { Modal } from "@src/components/Layout/Modal";
import { Address } from "@src/types/common";
import { useToast } from "../Layout/Toast";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { deleteMemoirFromUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { removeOneFromMemoirs } from "@src/store/slices/anthologySlice";

interface DeleteMemoirProps {
  anthologyAddr: Address;
  index: number;
}

export const DeleteMemoir: React.FC<DeleteMemoirProps> = ({
  anthologyAddr,
  index,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const memoir = useAppSelector((state) =>
    isLocalAnthology(anthologyAddr)
      ? state.localAnthology.anthologies[anthologyAddr][index]
      : state.anthology[anthologyAddr].memoirs[index]
  );

  const handleDelete = async ({
    anthologyAddr,
    index,
  }: {
    anthologyAddr: Address;
    index: number;
  }) => {
    if (isLocalAnthology(anthologyAddr)) {
      try {
        dispatch(
          deleteMemoirFromUserLocalAnthology({
            contract: anthologyAddr,
            memoir,
          })
        );
        addToast({
          title: "Memoir deleted",
          content: memoir.title,
          variant: "success",
        });
      } catch (error) {
        console.log("Error deleting memoir from local anthology:", error);
        addToast({
          title: "Error deleting memoir",
          content: "Error deleting memoir",
          variant: "danger",
        });
      }
    } else {
      try {
        const txHash = await writeAnthology(anthologyAddr, "deleteMemoir", [
          index,
        ]);
        console.log("Deleting TxHash:", txHash);
        dispatch(
          removeOneFromMemoirs({
            contract: anthologyAddr,
            memoirIndex: index,
          })
        );
        if (txHash) {
          addToast({
            title: "Memoir deleted",
            content: "TxHash: " + txHash,
            variant: "danger",
          });
        }
      } catch (error) {
        console.error("Error deleting memoir:", error);
        addToast({
          title: "Error deleting memoir",
          content: "Error deleting memoir",
          variant: "danger",
        });
      }
    }
  };

  console.log("it does render every time");

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={<span onClick={() => setShow(true)}>❌</span>}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          Are you sure you want to delete:
        </span>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //border: "1px solid black",
            //borderRadius: "7px",
            padding: "5px",
          }}
        >
          <span style={{ fontWeight: "bold", textAlign: "center" }}>
            {memoir.title}
          </span>

          <span
            style={{
              whiteSpace: "normal",
              wordBreak: "break-all",
              overflowWrap: "break-word",
              margin: "15px",
            }}
          >
            {memoir.content}
          </span>
        </div>

        <br />

        <button
          style={{ backgroundColor: "red" }}
          onClick={() => {
            handleDelete({ anthologyAddr, index });
            handleClose();
          }}
        >
          YES, DELETE
        </button>
        <span style={{ fontSize: "12px", color: "red" }}>
          This action cannot be undone.
        </span>
      </div>
    </Modal>
  );
};
