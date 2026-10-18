import { useState } from "react";
import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { updateMemoirInUserLocalAnthology } from "@src/store/slices/localAnthologySlice";
import { useAppDispatch } from "@src/store/utils/hooks";
import { useToast } from "../Layout/Toast";
import { Modal } from "../Layout/Modal";

export const EditMemoir = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(memoir.title);
  const [content, setContent] = useState(memoir.content);

  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const handleOpen = () => {
    setTitle(memoir.title);
    setContent(memoir.content);
    setShow(true);
  };

  const handleSave = () => {
    dispatch(
      updateMemoirInUserLocalAnthology({
        contract: anthologyAddr,
        index,
        title,
        content,
      })
    );
    addToast({
      title: "Memoir updated",
      content: "Your changes were saved locally",
      variant: "success",
      delay: 5000,
    });
    setShow(false);
  };

  return (
    <Modal
      placement="bottom"
      show={show}
      onHide={() => setShow(false)}
      trigger={
        <span
          title="Edit memoir"
          style={{ cursor: "pointer", fontSize: "1rem" }}
          onClick={handleOpen}
        >
          <img
            src="/icons/edit-icon.svg"
            alt="Edit memoir"
            style={{ width: "18px", height: "18px", display: "block" }}
          />
        </span>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <h4 style={{ textAlign: "center", margin: 0 }}>Edit Memoir</h4>

        <label style={{ fontWeight: 500 }}>Title</label>
        <input
          value={title}
          maxLength={50}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid #d1d5db",
            fontSize: "0.95rem",
            color: "#111",
            backgroundColor: "#fff",
            outline: "none",
          }}
        />

        <label style={{ fontWeight: 500 }}>Content</label>
        <textarea
          value={content}
          maxLength={255}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            height: "8rem",
            resize: "none",
            padding: "0.75rem",
            fontSize: "0.875rem",
            fontFamily: "monospace",
            backgroundColor: "#fff",
            color: "#111",
            border: "1px solid #d1d5db",
            borderRadius: "0.75rem",
          }}
        />

        <button
          onClick={handleSave}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            fontWeight: 600,
            fontSize: "0.95rem",
            backgroundColor: "#111827",
            color: "#fff",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};
