import { describe, expect, test } from "bun:test";
import {
  addMemoirToUserLocalAnthology,
  addManyMemoirsToUserLocalAnthology,
  clearMemoirsInUserLocalAnthology,
  deleteMemoirAtIndexFromUserLocalAnthology,
  deleteUserLocalAnthology,
  localAnthologySlice,
  markAnthologiesReceived,
  updateLocalContractTitles,
  updateMemoirInUserLocalAnthology,
  updateUserLocalAnthologyTitle,
} from "../src/store/slices/localAnthologySlice";
import { LOCAL_USER_ADDR } from "../src/utils/constants";

const reducer = localAnthologySlice.reducer;
const contract = "0x12345678901234567890" as const;
const other = "0xabcdefabcdefabcdefab" as const;
const memoir = {
  sender: LOCAL_USER_ADDR,
  title: "t",
  content: "c",
  timestamp: "1",
};
const sender = {
  deviceId: "1x12345678901234567890" as const,
  nametag: "Ana",
  receivedAt: 10,
};

const base = () => {
  const state = reducer(undefined, { type: "@@INIT" });
  return {
    ...state,
    anthologies: { [contract]: [memoir], [other]: [memoir] },
    receivedFrom: { [contract]: sender },
    contractsTitles: { [contract]: "Shared", [other]: "Mine" },
    userContracts: { [LOCAL_USER_ADDR]: [contract, other] },
  };
};

describe("read-only connected anthologies", () => {
  test("blocks add, edit, delete, clear, and rename", () => {
    let state = base();
    state = reducer(
      state,
      addMemoirToUserLocalAnthology({ contract, memoir })
    );
    expect(state.anthologies[contract]).toHaveLength(1);

    state = reducer(
      state,
      updateMemoirInUserLocalAnthology({
        contract,
        index: 0,
        title: "x",
        content: "y",
      })
    );
    expect(state.anthologies[contract][0].title).toBe("t");

    state = reducer(
      state,
      deleteMemoirAtIndexFromUserLocalAnthology({ contract, index: 0 })
    );
    expect(state.anthologies[contract]).toHaveLength(1);

    state = reducer(state, clearMemoirsInUserLocalAnthology({ contract }));
    expect(state.anthologies[contract]).toHaveLength(1);

    state = reducer(
      state,
      updateUserLocalAnthologyTitle({ contract, newTitle: "x" })
    );
    expect(state.contractsTitles[contract]).toBe("Shared");
  });

  test("still allows edits on own anthologies", () => {
    let state = base();
    state = reducer(
      state,
      addMemoirToUserLocalAnthology({ contract: other, memoir })
    );
    expect(state.anthologies[other]).toHaveLength(2);
  });

  test("still allows imports to append", () => {
    let state = base();
    state = reducer(
      state,
      addManyMemoirsToUserLocalAnthology({
        contract,
        memoirs: [{ ...memoir, title: "new" }],
      })
    );
    expect(state.anthologies[contract]).toHaveLength(2);
  });

  test("markAnthologiesReceived only marks existing anthologies", () => {
    const added = "0x99999999999999999999" as const;
    let state = base();
    state = {
      ...state,
      anthologies: { ...state.anthologies, [added]: [memoir] },
    };
    state = reducer(
      state,
      markAnthologiesReceived({
        addresses: [added, "0xdeadbeefdeadbeefdead" as const],
        deviceId: sender.deviceId,
        nametag: "Ana",
        receivedAt: 20,
      })
    );
    expect(state.receivedFrom[added]?.nametag).toBe("Ana");
    expect(
      state.receivedFrom["0xdeadbeefdeadbeefdead" as const]
    ).toBeUndefined();
  });

  test("updateLocalContractTitles skips connected titles", () => {
    let state = base();
    state = reducer(
      state,
      updateLocalContractTitles({ [contract]: "Renamed", [other]: "Mine2" })
    );
    expect(state.contractsTitles[contract]).toBe("Shared");
    expect(state.contractsTitles[other]).toBe("Mine2");
  });

  test("deleteUserLocalAnthology removes provenance", () => {
    let state = base();
    state = reducer(
      state,
      deleteUserLocalAnthology({ user: LOCAL_USER_ADDR, contract })
    );
    expect(state.receivedFrom[contract]).toBeUndefined();
  });
});
