import { writeAnthology } from "@src/contract-functions/anthologyFunctions";
import { removeOneFromBuffer } from "@store/slices/anthologySlice";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
import { useTranslation } from "@src/i18n/useTranslation";

export const MemoirBuffer = ({ contractAddr }: { contractAddr: string }) => {
  const { t } = useTranslation();
  const memoirBuffer = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr].memoirBuffer : []
  );
  //const [memoirBuffer, setMemoirBuffer] = useState<MemoirInterface[]>([]);
  const dispatch = useAppDispatch();

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
            <span>{t("memoirs.titleLabel")} </span>
            <span translate="no">{memoir.title}</span>
            <div>{t("memoirs.contentLabel")}</div>
            <div translate="no">{memoir.content}</div>
            <div>{t("memoirs.sentBy")}</div>
            <div>{shortenAddress(memoir.sender, 10, 8)}</div>
            <span>{t("memoirs.whenAdded")} </span>
            <span>{memoir.timestamp}</span>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <button
                type="button"
                className="icon-button"
                title={t("memoir.accept")}
                aria-label={t("memoir.accept")}
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
              </button>
              <button
                type="button"
                className="icon-button"
                title={t("memoirs.decline")}
                aria-label={t("memoirs.decline")}
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
                <img
                  src="/icons/delete-icon.svg"
                  alt=""
                  style={{
                    width: "16px",
                    height: "16px",
                    display: "block",
                    filter: "invert(1)",
                  }}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
