import { useAppDispatch } from "@src/store/utils/hooks";
import { Modal } from "./Modal";
import { useState } from "react";
import { persistor } from "@src/store/redux";
import { useToast } from "./Toast";
import { resetAnthologyStore } from "@src/store/slices/anthologySlice";
import { resetFactoryStore } from "@src/store/slices/factorySlice";
import { resetDappStore } from "@src/store/slices/dappSlice";
import { resetUserStore } from "@src/store/slices/userSlice";
import { resetLocalAnthologyStore } from "@src/store/slices/localAnthologySlice";
import { resetConnectStore } from "@src/store/slices/connectSlice";
import { useTranslation } from "@src/i18n/useTranslation";

export const CleanReduxStore = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const dispatch = useAppDispatch();

  const { addToast } = useToast();

  return (
    <Modal
      show={show}
      onHide={handleClose}
      disablePattern
      trigger={
        <button
          type="button"
          style={{
            backgroundColor: "#7f1d1d",
            border: "1px solid #b91c1c",
            color: "white",
            padding: "9px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => {
            setShow(true);
          }}
        >
          {t("clean.deleteMemory")}
        </button>
      }
    >
      <div
        style={{
          margin: "30px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", textAlign: "center" }}>
          {t("clean.deleteTitle")}
          <br />
          {t("clean.allAnthologies")}
        </span>

        <span>{t("clean.cannotUndo")}</span>
      </div>

      <button
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
        }}
        onClick={async () => {
          dispatch(resetAnthologyStore());
          dispatch(resetFactoryStore());
          dispatch(resetDappStore());
          dispatch(resetUserStore());
          dispatch(resetLocalAnthologyStore());
          dispatch(resetConnectStore());
          //clear CP timestamps in local storage
          localStorage.clear();

          await persistor.purge();
          setTimeout(() => {
            window.location.reload();
          }, 3000);

          addToast({
            title: t("clean.deletedTitle"),
            content: t("clean.deletedDesc"),
            variant: "info",
          });
        }}
      >
        {t("clean.deleteMemory")}
      </button>
    </Modal>
  );
};
