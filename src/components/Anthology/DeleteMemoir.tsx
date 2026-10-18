import { useState } from "react";
import "./style.css";
import { Modal } from "@src/components/Layout/Modal";
import { Address } from "@src/types/common";
import { useToast } from "../Layout/Toast";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { deleteMemoirAtIndexFromUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { removeOneFromMemoirs } from "@src/store/slices/anthologySlice";
import { useTranslation } from "@src/i18n/useTranslation";

interface DeleteMemoirProps {
  anthologyAddr: Address;
  index: number;
}

export const DeleteMemoir: React.FC<DeleteMemoirProps> = ({
  anthologyAddr,
  index,
}) => {
  const { t } = useTranslation();
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
          deleteMemoirAtIndexFromUserLocalAnthology({
            contract: anthologyAddr,
            index,
          })
        );
        addToast({
          title: t("delete.deleted"),
          content: memoir.title,
          variant: "success",
        });
      } catch (error) {
        console.log("Error deleting memoir from local anthology:", error);
        addToast({
          title: t("delete.errorTitle"),
          content: t("delete.errorTitle"),
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
            title: t("delete.deleted"),
            content: "TxHash: " + txHash,
            variant: "danger",
          });
        }
      } catch (error) {
        console.error("Error deleting memoir:", error);
        addToast({
          title: t("delete.errorTitle"),
          content: t("delete.errorTitle"),
          variant: "danger",
        });
      }
    }
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={handleClose}
      trigger={
        <span
          title={t("memoir.deleteTitle")}
          style={{ cursor: "pointer", fontSize: "1rem", display: "block" }}
          onClick={() => setShow(true)}
        >
          <img
            src="/icons/delete-icon.svg"
            alt={t("memoir.deleteTitle")}
            style={{ width: "18px", height: "18px", display: "block" }}
          />
        </span>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          {t("delete.confirmTitle")}
        </span>
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "250px",
            border: "1px solid black",
            borderRadius: "7px",
            padding: "5px",
            margin: "10px 0px",
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
          {t("delete.yesDelete")}
        </button>
        <span style={{ fontSize: "12px", color: "red" }}>
          {t("delete.cannotUndo")}
        </span>
      </div>
    </Modal>
  );
};
