import { Address } from "@src/types/common";
import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { DeleteMemoir } from "./DeleteMemoir";
import { EditMemoir } from "./EditMemoir";

export const MemoirActions = ({
  anthologyAddr,
  index,
  memoir,
}: {
  anthologyAddr: Address;
  index: number;
  memoir: MemoirInterface;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    {isLocalAnthology(anthologyAddr) && (
      <EditMemoir anthologyAddr={anthologyAddr} index={index} memoir={memoir} />
    )}
    <DeleteMemoir anthologyAddr={anthologyAddr} index={index} />
  </div>
);
