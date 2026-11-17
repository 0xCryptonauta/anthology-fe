import { describe, expect, test } from "bun:test";
import type { LocalId } from "../src/types/connect";
import type { ConnectionGroup } from "../src/utils/groupConnections";
import { searchConnectedAnthologies } from "../src/utils/searchConnectedAnthologies";

const a = "0x11111111111111111111" as const;
const b = "0x22222222222222222222" as const;
const device = "1x11111111111111111111" as LocalId;

const group = (
  nametag: string,
  anthologies: ConnectionGroup["anthologies"]
): ConnectionGroup => ({
  deviceId: device,
  nametag,
  firstConnectedAt: 1,
  lastConnectedAt: 1,
  anthologies,
});

describe("searchConnectedAnthologies", () => {
  const groups = [
    group("Ana", [
      {
        address: a,
        title: "[Poetry][Haiku]Spring Rain",
        memoirCount: 9,
        receivedAt: 1,
      },
      {
        address: b,
        title: "[Essays]The Long Road",
        memoirCount: 5,
        receivedAt: 1,
      },
    ]),
  ];

  test("matches category, subcategory, and title case-insensitively", () => {
    expect(
      searchConnectedAnthologies(groups, "haiku").map((result) => result.title)
    ).toEqual(["[Poetry][Haiku]Spring Rain"]);
    expect(
      searchConnectedAnthologies(groups, "  SPRING ").map(
        (result) => result.title
      )
    ).toEqual(["[Poetry][Haiku]Spring Rain"]);
    expect(
      searchConnectedAnthologies(groups, "essays").map(
        (result) => result.title
      )
    ).toEqual(["[Essays]The Long Road"]);
  });

  test("includes the contact and memoir count with each result", () => {
    const [result] = searchConnectedAnthologies(groups, "spring");
    expect(result.nametag).toBe("Ana");
    expect(result.memoirCount).toBe(9);
  });

  test("returns an empty list for an empty or unmatched query", () => {
    expect(searchConnectedAnthologies(groups, "")).toEqual([]);
    expect(searchConnectedAnthologies(groups, "zzz")).toEqual([]);
  });
});
