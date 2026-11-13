import { describe, expect, test } from "bun:test";
import {
  buildShareEnvelope,
  decodeSharePayload,
  validateNametag,
  validateSharedBy,
} from "../src/utils/shareEnvelope";

const sender = { deviceId: "1x12345678901234567890", nametag: "Ana" } as const;
const single = {
  anthology: {
    contractAddr: "0x12345678901234567890",
    title: "Test",
    anthology: [],
    defaultSkin: "list",
  },
};
const group = {
  localMemory: {
    users: ["0x0000000000000000000000000000000000000000"],
    userContracts: {
      "0x0000000000000000000000000000000000000000": [
        "0x12345678901234567890",
      ],
    },
    contractsTitles: { "0x12345678901234567890": "Test" },
    anthologies: { "0x12345678901234567890": [] },
    defaultSkin: { "0x12345678901234567890": "list" },
  },
};

describe("shareEnvelope", () => {
  test("builds an envelope with sharedBy and sharedAt", () => {
    const env = buildShareEnvelope(single, sender, 1234);
    expect(env.sharedBy).toEqual(sender);
    expect(env.sharedAt).toBe(1234);
    expect(env.anthology?.title).toBe("Test");
  });

  test("validates nametags", () => {
    expect(validateNametag("")).toBe("empty");
    expect(validateNametag("   ")).toBe("empty");
    expect(validateNametag("x".repeat(33))).toBe("too-long");
    expect(validateNametag(" Ana ")).toBeNull();
  });

  test("validates sharedBy", () => {
    expect(validateSharedBy(sender)).toEqual(sender);
    expect(validateSharedBy({ ...sender, deviceId: "0x1234" })).toBeNull();
    expect(validateSharedBy({ ...sender, nametag: "  " })).toBeNull();
    expect(validateSharedBy(null)).toBeNull();
  });

  test("decodes a single anthology share", () => {
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(single, sender))
    );
    const out = decodeSharePayload(bytes);
    expect(out.ok).toBe(true);
    if (out.ok) expect(out.sharedBy.nametag).toBe("Ana");
  });

  test("decodes a group share", () => {
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(group, sender))
    );
    expect(decodeSharePayload(bytes).ok).toBe(true);
  });

  test("rejects invalid JSON", () => {
    const out = decodeSharePayload(new TextEncoder().encode("{"));
    expect(out).toEqual({ ok: false, reason: "invalid-json" });
  });

  test("rejects JSON that is not an anthology", () => {
    const bytes = new TextEncoder().encode(
      JSON.stringify({
        ...buildShareEnvelope(
          {
            discoveries: {
              users: [],
              userContracts: {},
              contractsTitles: {},
            },
          },
          sender
        ),
      })
    );
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });

  test("rejects a missing sender", () => {
    const bytes = new TextEncoder().encode(JSON.stringify(single));
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "missing-sender",
    });
  });
});
