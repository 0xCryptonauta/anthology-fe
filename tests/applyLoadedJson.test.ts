import { describe, expect, test } from "bun:test";
import {
  addMemoryToMemory,
  addOneAnthologyToLocal,
  addressesToMark,
} from "../src/utils/applyLoadedJson";
import { LOCAL_USER_ADDR } from "../src/utils/constants";
import type { AppDispatch } from "../src/store/redux";
import type { LoadedJson } from "../src/utils/validateJsonContentType";

const contract = "0x12345678901234567890" as const;
const other = "0xabcdefabcdefabcdefab" as const;
const added = "0x99999999999999999999" as const;
const memoir = {
  sender: LOCAL_USER_ADDR,
  title: "t",
  content: "c",
  timestamp: "1",
};

const dispatch = ((action: unknown) => action) as unknown as AppDispatch;

const single = {
  anthology: {
    contractAddr: contract,
    title: "T",
    anthology: [memoir],
    defaultSkin: "list",
  },
} as unknown as LoadedJson;

const group = {
  localMemory: {
    users: [LOCAL_USER_ADDR],
    userContracts: { [LOCAL_USER_ADDR]: [contract, other] },
    contractsTitles: { [contract]: "T", [other]: "O" },
    anthologies: { [contract]: [memoir], [other]: [memoir] },
    defaultSkin: { [contract]: "list", [other]: "list" },
  },
} as unknown as LoadedJson;

const received = {
  deviceId: "1x12345678901234567890" as const,
  nametag: "Ana",
  receivedAt: 1,
};

describe("addressesToMark", () => {
  test("excludes existing own anthologies", () => {
    expect(addressesToMark([other], [other], {})).toEqual([]);
  });

  test("includes newly added anthologies", () => {
    expect(addressesToMark([contract], [], {})).toEqual([contract]);
  });

  test("includes already received anthologies for a provenance update", () => {
    expect(
      addressesToMark([contract], [contract], { [contract]: received })
    ).toEqual([contract]);
  });

  test("keeps own and new distinct in one batch", () => {
    expect(
      addressesToMark([contract, other, added], [other], {})
    ).toEqual([contract, added]);
  });
});

describe("import helpers return only addresses to mark", () => {
  test("single: own is excluded, new is included, received is included", () => {
    expect(
      addOneAnthologyToLocal(dispatch, single, {
        existingOwn: [contract],
        receivedFrom: {},
      })
    ).toEqual([]);

    expect(
      addOneAnthologyToLocal(dispatch, single, {
        existingOwn: [],
        receivedFrom: {},
      })
    ).toEqual([contract]);

    expect(
      addOneAnthologyToLocal(dispatch, single, {
        existingOwn: [contract],
        receivedFrom: { [contract]: received },
      })
    ).toEqual([contract]);
  });

  test("group: own addresses are excluded and new ones are returned", () => {
    expect(
      addMemoryToMemory(dispatch, group, {
        existingOwn: [other],
        receivedFrom: {},
      })
    ).toEqual([contract]);
  });

  test("malformed single payloads dispatch nothing and mark nothing", () => {
    const bad = {
      anthology: { contractAddr: contract },
    } as unknown as LoadedJson;

    expect(
      addOneAnthologyToLocal(dispatch, bad, {
        existingOwn: [],
        receivedFrom: {},
      })
    ).toEqual([]);
  });

  test("malformed group payloads dispatch nothing and mark nothing", () => {
    const bad = {
      localMemory: {
        users: [],
        userContracts: null,
        contractsTitles: null,
        anthologies: null,
        defaultSkin: null,
      },
    } as unknown as LoadedJson;

    expect(
      addMemoryToMemory(dispatch, bad, {
        existingOwn: [],
        receivedFrom: {},
      })
    ).toEqual([]);
  });
});
