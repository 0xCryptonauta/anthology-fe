import { describe, expect, test } from "bun:test";
import { generateLocalId, isLocalId } from "../src/utils/localId";

describe("localId", () => {
  test("generates 1x + 20 lowercase hex chars", () => {
    expect(generateLocalId()).toMatch(/^1x[0-9a-f]{20}$/);
  });

  test("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateLocalId()));
    expect(ids.size).toBe(100);
  });

  test("validates the format", () => {
    expect(isLocalId("1x12345678901234567890")).toBe(true);
    expect(isLocalId("0x12345678901234567890")).toBe(false);
    expect(isLocalId("1x1234")).toBe(false);
    expect(isLocalId("1X12345678901234567890")).toBe(false);
    expect(isLocalId(null)).toBe(false);
  });
});
