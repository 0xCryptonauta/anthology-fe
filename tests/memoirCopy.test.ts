import { describe, expect, test } from "bun:test";
import { buildCopiedMemoir } from "../src/utils/memoirCopy";
import { LOCAL_USER_ADDR } from "../src/utils/constants";
import type { MemoirInterface } from "../src/store/slices/anthologySlice";

const memoir: MemoirInterface = {
  sender: "0xabcdefabcdefabcdefab",
  title: "A memory",
  content: "Some content",
  timestamp: "123",
} as MemoirInterface;

describe("buildCopiedMemoir", () => {
  test("preserves the memoir and marks the local user as the owner", () => {
    const copy = buildCopiedMemoir(memoir);
    expect(copy).toEqual({ ...memoir, sender: LOCAL_USER_ADDR });
    expect(copy).not.toBe(memoir);
  });

  test("does not mutate the source memoir", () => {
    buildCopiedMemoir(memoir);
    expect(memoir.sender).toBe("0xabcdefabcdefabcdefab");
  });
});
