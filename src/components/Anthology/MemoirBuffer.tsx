import { writeAnthology } from "../../contract-functions/AnthologyFunctions";
import { removeOneFromBuffer } from "../../slices/anthologySlice";
import { shortenAddress } from "../../utils/shortenAddress";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

export const MemoirBuffer = ({ contractAddr }: { contractAddr: string }) => {
  const memoirBuffer = useSelector((state: RootState) =>
    contractAddr ? state.anthology[contractAddr].memoirBuffer : []
  );
  //const [memoirBuffer, setMemoirBuffer] = useState<MemoirInterface[]>([]);
  const dispatch = useDispatch();

  return (
    <div>
      {memoirBuffer.map((memoir, index) => {
        return (
          <div
            key={index}
            style={{
              //border: "1px solid white",
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
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <span
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const txHash = await writeAnthology(
                    contractAddr,
                    "acceptMemoir",
                    [index]
                  );
                  console.log("Hash:", txHash);

                  dispatch(
                    removeOneFromBuffer({
                      contract: contractAddr,
                      memoirIndex: index,
                    })
                  );
                }}
              >
                ✅
              </span>
              <span
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  const txHash = await writeAnthology(
                    contractAddr,
                    "declineMemoir",
                    [index]
                  );
                  console.log("Hash:", txHash);
                  dispatch(
                    removeOneFromBuffer({
                      contract: contractAddr,
                      memoirIndex: index,
                    })
                  );
                }}
              >
                ❌
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
