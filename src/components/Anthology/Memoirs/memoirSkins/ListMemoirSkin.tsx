import { OrderType } from "@src/components/Layout/OrderSelector";
import { useOrderedMemoirs } from "@src/hooks/useOrderedMemoirs";
import { useAppSelector } from "@src/store/utils/hooks";
import { Address } from "@src/types/common";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { useAccount } from "wagmi";
import { DeleteMemoir } from "../../DeleteMemoir";
import { Modal } from "@src/components/Layout/Modal";
import { useState } from "react";
import { Mediaskin } from "./MediaSkin";

interface ListMemoirSkinProps {
  anthologyAddr: Address;
  order: OrderType;
}

export const ListMemoirSkin: React.FC<ListMemoirSkinProps> = ({
  anthologyAddr,
  order,
  //handleDelete,
}) => {
  const { memoirs, orderedMemoirsIndexes } = useOrderedMemoirs(
    anthologyAddr,
    order
  );
  const [selectedMemoirIndex, setSelectedMemoirIndex] = useState(-1);
  const handleClose = () => setSelectedMemoirIndex(-1);

  const { address: currentUser } = useAccount();
  const anthologyOwner = useAppSelector(
    (state) => state.anthology[anthologyAddr]?.anthologyState?.owner
  );

  if (!memoirs || memoirs.length === 0) {
    return <p style={{ margin: "30px" }}>No memoirs available.</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {orderedMemoirsIndexes.map((i, index) => {
        const { title, content } = memoirs[i];

        return (
          <div
            key={i}
            style={{
              width: "100%",
              minWidth: "300px",
              maxWidth: "600px",
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: "#333",
                display: "block",
                marginBottom: "0.25rem",
                wordBreak: "break-word",
              }}
            >
              {index + 1}. {title || "Untitled"}
            </span>
            <p
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                color: "#555",
                fontSize: "0.9rem",
                wordBreak: "break-word",
                cursor: "pointer",
              }}
              onClick={() => setSelectedMemoirIndex(i)}
            >
              {content}
            </p>
            {(currentUser === anthologyOwner ||
              isLocalAnthology(anthologyAddr) ||
              currentUser === memoirs[i].sender) && (
              <div
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "10px",
                  top: "10px",
                }}
                /*  onClick={() =>
                  handleDelete({
                    anthologyAddr,
                    index: i,
                  })
                } */
              >
                <DeleteMemoir anthologyAddr={anthologyAddr} index={i} />
              </div>
            )}
            <Modal
              show={selectedMemoirIndex === i}
              onHide={handleClose}
              transparent
            >
              <Mediaskin memoir={memoirs[i]} />
            </Modal>
          </div>
        );
      })}
    </div>
  );
};
