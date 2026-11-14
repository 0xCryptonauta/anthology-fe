import { describe, expect, test } from "bun:test";
import { filterShareableAddresses } from "../src/utils/localMemoryPayload";

const a = "0x11111111111111111111" as const;
const b = "0x22222222222222222222" as const;
const c = "0x33333333333333333333" as const;
const received = {
  deviceId: "1x12345678901234567890" as const,
  nametag: "Ana",
  receivedAt: 1,
};

describe("filterShareableAddresses", () => {
  test("excludes connected addresses and reports how many were skipped", () => {
    expect(
      filterShareableAddresses([a, b, c], { [b]: received })
    ).toEqual({ shareable: [a, c], skipped: 1 });
  });

  test("returns an empty list when every address is connected", () => {
    expect(
      filterShareableAddresses([a, b], { [a]: received, [b]: received })
    ).toEqual({ shareable: [], skipped: 2 });
  });

  test("keeps every address when nothing is connected", () => {
    expect(
      filterShareableAddresses([a, b], {})
    ).toEqual({ shareable: [a, b], skipped: 0 });
  });
});
