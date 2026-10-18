import { Card } from "@components/Layout/Card";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { useState } from "react";
//import { useParams } from "react-router-dom";
import "./style.css";
import { Address } from "@src/types/common";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";
import { Modal } from "@src/components/Layout/Modal";
import { useToast } from "@src/components/Layout/Toast";
import { deleteUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { LOCAL_USER_ADDR, LOCAL_USER_PATH } from "@src/utils/constants";

interface LocalAnthologyStateProps {
  contractAddr: Address;
}

export const LocalAnthologyState: React.FC<LocalAnthologyStateProps> = ({
  contractAddr,
}) => {
  const currentTitle = useAppSelector(
    (state) => state.localAnthology.contractsTitles[contractAddr]
  );
  const anthology = useAppSelector(
    (state) => state.localAnthology.anthologies[contractAddr]
  );
  const defaultSkin = useAppSelector(
    (state) => state.localAnthology.defaultSkin[contractAddr]
  );

  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const downloadLocalAnthology = () => {
    const anthologyData = {
      anthology: {
        contractAddr: contractAddr,
        title: currentTitle,
        anthology: anthology,
        defaultSkin: defaultSkin,
      },
    };
    downloadObjAsJson(
      anthologyData,
      `${currentTitle.replace(/\s+/g, "_")}_anthology.json`
    );
  };

  const handleDeleteAnthology = () => {
    dispatch(
      deleteUserLocalAnthology({
        user: LOCAL_USER_ADDR,
        contract: contractAddr,
      })
    );

    dispatch(updateCurrentPath(LOCAL_USER_PATH));
    window.history.pushState(
      { currentPath: LOCAL_USER_PATH },
      "",
      window.location.pathname
    );

    addToast({
      title: "Anthology deleted",
      content: "The anthology and all its memoirs were deleted.",
      variant: "success",
      delay: 5000,
    });

    setShowDeleteModal(false);
  };

  return (
    <div
      style={{
        //border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        maxWidth: "380px",
        boxSizing: "border-box",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Card title="Title" content={currentTitle} />

      <Card title="Anthology length" content={anthology?.length ?? 0} />

      <Card title="maxMemoirs" content="100" />

      <Card title="Default Skin" content={defaultSkin} />

      <Card
        title="Download Anthology"
        content={
          <span
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={downloadLocalAnthology}
          >
            💾
          </span>
        }
      />

      <Card
        title="Delete Anthology"
        content={
          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            trigger={
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowDeleteModal(true)}
              >
                <img
                  src="/icons/delete-icon.svg"
                  alt="Delete anthology"
                  style={{ width: "20px", height: "20px", display: "block" }}
                />
              </span>
            }
          >
            <div
              style={{
                margin: "30px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontWeight: "bold", textAlign: "center" }}>
                Delete this anthology?
              </span>
              <span style={{ textAlign: "center" }}>
                All its memoirs will be deleted too. This action cannot be
                undone.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#e2e8f0",
                  color: "#1a1a1a",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleDeleteAnthology}
              >
                Delete Anthology
              </button>
            </div>
          </Modal>
        }
      />
    </div>
  );
};
