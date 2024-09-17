import { useDispatch, useSelector } from "react-redux";
import { shortenAddress } from "../../functions/shortenAddress";
import { RootState } from "../../store";
import { writeAnthology } from "../ContractFunctions/AnthologyFunctions";
import { removeOneFromMemoirs } from "../../slices/anthologySlice";

export const Memoirs = ({ contractAddr }: { contractAddr: string }) => {
  const anthology = useSelector((state: RootState) =>
    contractAddr ? state.anthology : undefined
  );

  const dispatch = useDispatch();

  return (
    <div
      style={{
        border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
      }}
    >
      <span>Memoirs:</span>
      {anthology &&
        anthology[contractAddr]?.memoirs.map((memoir, index) => {
          return (
            <div
              key={index}
              style={{
                border: "1px solid white",
                maxWidth: "500px",
                padding: "5px",
                borderRadius: "7px",
                margin: "3px",
              }}
            >
              <span>Title: </span>
              <span>{memoir.title}</span>
              <div>Content:</div>
              <div>{memoir.content}</div>
              <div>Sent by:</div>
              <div>{shortenAddress(memoir.sender, 10, 8)}</div>
              <span>When added: </span>
              <span>{memoir.timestamp}</span>

              <span
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const txHash = await writeAnthology(
                    contractAddr,
                    "deleteMemoir",
                    [index]
                  );
                  console.log("Hash:", txHash);
                  dispatch(
                    removeOneFromMemoirs({
                      contract: contractAddr,
                      memoirIndex: index,
                    })
                  );
                }}
              >
                ❌
              </span>
            </div>
          );
        })}
    </div>
  );
};
