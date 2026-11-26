import { useMemo } from "react";
import { UserContracts } from "@components/Factory/UserContracts";
import { MemoirContent } from "@src/types/common";
import { useAppSelector } from "@src/store/utils/hooks";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { getOwnLocalAddresses } from "@src/utils/localMemoryPayload";

export const LocalUserView = () => {
  const localAnthology = useAppSelector((state) => state.localAnthology);
  const { contractsTitles, anthologies } = localAnthology;

  const ownAddresses = useMemo(
    () => getOwnLocalAddresses(localAnthology),
    [localAnthology]
  );

  const memoirCounts = useMemo(
    () =>
      Object.fromEntries(
        ownAddresses.map((address) => [
          address,
          (anthologies[address] || []).length,
        ])
      ),
    [ownAddresses, anthologies]
  );

  const userTitles: MemoirContent[] = useMemo(
    () =>
      ownAddresses.map((contractAddr, index) => ({
        address: contractAddr,
        title: contractsTitles[contractAddr] || "",
        originalIndex: index,
      })),
    [ownAddresses, contractsTitles]
  );

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
        width: "100%",
        minWidth: 0,
      }}
    >
      <UserContracts
        userAddr={LOCAL_USER_ADDR}
        userTitles={userTitles}
        memoirCounts={memoirCounts}
      />
    </div>
  );
};
