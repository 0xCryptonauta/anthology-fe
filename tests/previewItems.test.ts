import { describe, expect, test } from "bun:test";
import type { MemoirInterface } from "../src/store/slices/anthologySlice";
import { buildPreviewItems } from "../src/utils/previewItems";

const a = "0x11111111111111111111" as const;
const b = "0x22222222222222222222" as const;

const memoir = (title = "memoir"): MemoirInterface => ({
  sender: a,
  title,
  content: "",
  timestamp: "1",
});

describe("buildPreviewItems", () => {
  test("returns one row for a single anthology", () => {
    const items = buildPreviewItems("single", {
      anthology: {
        contractAddr: a,
        title: "[Poetry][Haiku]Spring Rain",
        anthology: [memoir("one"), memoir("two")],
        defaultSkin: "text",
      },
    });

    expect(items).toEqual([
      {
        address: a,
        title: "[Poetry][Haiku]Spring Rain",
        memoirCount: 2,
      },
    ]);
  });

  test("returns one row per anthology for a memory", () => {
    const items = buildPreviewItems("group", {
      localMemory: {
        users: [],
        userContracts: {},
        contractsTitles: { [a]: "[Poetry]First" },
        anthologies: {
          [a]: [memoir()],
          [b]: [memoir(), memoir()],
        },
        defaultSkin: {},
      },
    });

    expect(items).toEqual([
      { address: a, title: "[Poetry]First", memoirCount: 1 },
      { address: b, title: b, memoirCount: 2 },
    ]);
  });

  test("returns an empty list when the payload has neither shape", () => {
    expect(buildPreviewItems("group", {})).toEqual([]);
    expect(buildPreviewItems("single", {})).toEqual([]);
  });
});
