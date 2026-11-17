import { describe, expect, test } from "bun:test";
import { formatContactName } from "../src/utils/connectDisplay";

const deviceId = "1x12345678901234567890" as const;

describe("formatContactName", () => {
  test("keeps a unique nametag unchanged", () => {
    expect(formatContactName("Ana", deviceId, false)).toBe("Ana");
  });

  test("adds the last three id characters when the nametag is duplicated", () => {
    expect(formatContactName("Ana", deviceId, true)).toBe("Ana:890");
  });
});
