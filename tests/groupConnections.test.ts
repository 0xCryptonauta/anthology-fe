import { describe, expect, test } from "bun:test";
import { groupConnections } from "../src/utils/groupConnections";

const a = "0x11111111111111111111" as const;
const b = "0x22222222222222222222" as const;
const c = "0x33333333333333333333" as const;

describe("groupConnections", () => {
  test("groups by device and uses the latest nametag", () => {
    const groups = groupConnections(
      {
        [a]: { deviceId: "1x11111111111111111111", nametag: "Ana", receivedAt: 10 },
        [b]: {
          deviceId: "1x11111111111111111111",
          nametag: "Ana María",
          receivedAt: 20,
        },
        [c]: {
          deviceId: "1x22222222222222222222",
          nametag: "Beto",
          receivedAt: 15,
        },
      },
      {
        [a]: [{ sender: "0x0", title: "", content: "", timestamp: "1" }],
        [b]: [],
        [c]: [],
      },
      { [a]: "A", [b]: "B", [c]: "C" }
    );
    expect(groups).toHaveLength(2);
    expect(groups[0].deviceId).toBe("1x11111111111111111111");
    expect(groups[0].nametag).toBe("Ana María");
    expect(groups[0].anthologies.map((x) => x.address)).toEqual([b, a]);
  });

  test("skips anthologies deleted from local memory", () => {
    const groups = groupConnections(
      {
        [a]: {
          deviceId: "1x11111111111111111111",
          nametag: "Ana",
          receivedAt: 10,
        },
      },
      {},
      {}
    );
    expect(groups).toEqual([]);
  });

  test("sorts groups by last connection", () => {
    const groups = groupConnections(
      {
        [a]: {
          deviceId: "1x11111111111111111111",
          nametag: "Ana",
          receivedAt: 10,
        },
        [c]: {
          deviceId: "1x22222222222222222222",
          nametag: "Beto",
          receivedAt: 30,
        },
      },
      { [a]: [], [c]: [] },
      {}
    );
    expect(groups[0].deviceId).toBe("1x22222222222222222222");
  });
});
