//import { useAppDispatch } from "@store/utils/hooks";
import { useAppSelector } from "@store/utils/hooks";
import { OrderType } from "../../Layout/OrderSelector";
import { useEffect, useState } from "react";
import { MemoirRenderer } from "./MemoirRenderer";
import { isLocalAnthology } from "@src/utils/isLocalAnthology";
import { Loading } from "@src/components/Layout/Loading";
import { Address, SkinType } from "@src/types/common";
import { useTranslation } from "@src/i18n/useTranslation";

interface MemoirsProps {
  anthologyAddr: Address;
  order: OrderType;
  skin: SkinType;
}

export const Memoirs: React.FC<MemoirsProps> = ({
  anthologyAddr,
  order,
  skin,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const anthology = useAppSelector((state) =>
    !isLocalAnthology(anthologyAddr)
      ? state.anthology[anthologyAddr]
      : undefined
  );

  const localAnthology = useAppSelector(
    (state) => state.localAnthology.anthologies[anthologyAddr]
  );

  //const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        //border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-evenly",
        position: "relative",
      }}
    >
      {!anthology && !localAnthology && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Loading />
        </div>
      )}

      {(anthology || localAnthology) && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("memoirs.searchPlaceholder")}
              style={{
                padding: "8px 32px 8px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                width: "100%",
                boxSizing: "border-box",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#111",
                outline: "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: 1,
                  color: "#64748b",
                  padding: 0,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {anthology && !isLocalAnthology(anthologyAddr) && (
        <MemoirRenderer
          anthologyAddr={anthologyAddr}
          order={order}
          skin={skin}
          search={search}
        />
      )}
      {isLocalAnthology(anthologyAddr) && (
        <MemoirRenderer
          anthologyAddr={anthologyAddr}
          order={order}
          skin={skin}
          search={search}
        />
      )}
    </div>
  );
};
