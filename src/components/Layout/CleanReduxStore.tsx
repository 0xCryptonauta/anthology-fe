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

export const CleanReduxStore = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const dispatch = useAppDispatch();

  const { addToast } = useToast();

  return (
    <Modal
      show={show}
      onHide={handleClose}
      trigger={
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            margin: "10px",
            borderRadius: "5px",
          }}
          onClick={() => {
            setShow(true);
          }}
        >
          CLEAN STORE
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
        <span style={{ fontWeight: "bold" }}>Clear all app data?</span>

        <span>This action cannot be undone.</span>
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

          await persistor.purge();
          setTimeout(() => {
            window.location.reload();
          }, 3000);

          addToast({
            title: "Redux Store Cleaned",
            content: "The store has been cleaned, reloading in 3 seconds...",
            variant: "info",
          });
        }}
      >
        CLEAN STORE
      </button>
    </Modal>
  );
};
