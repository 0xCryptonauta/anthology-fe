import { describe, expect, test } from "bun:test";
import {
  buildShareEnvelope,
  classifySharedBy,
  decodeSharePayload,
  validateNametag,
  validateSharedBy,
} from "../src/utils/shareEnvelope";
import type { LoadedJson } from "../src/utils/validateJsonContentType";

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

  test("classifies an absent, valid, and invalid sender", () => {
    expect(classifySharedBy(single).kind).toBe("absent");
    expect(
      classifySharedBy({ ...single, sharedBy: sender } as unknown as LoadedJson)
        .kind
    ).toBe("valid");
    expect(
      classifySharedBy({
        ...single,
        sharedBy: { ...sender, nametag: "x".repeat(33) },
      } as unknown as LoadedJson).kind
    ).toBe("invalid");
  });

  test("rejects a missing sender", () => {
    const bytes = new TextEncoder().encode(JSON.stringify(single));
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "missing-sender",
    });
  });

  test("rejects a 33-character nametag as an invalid sender", () => {
    const badSender = {
      ...single,
      sharedBy: {
        deviceId: sender.deviceId,
        nametag: "x".repeat(33),
      },
    } as unknown as LoadedJson;
    const bytes = new TextEncoder().encode(JSON.stringify(badSender));
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-sender",
    });
  });

  test("rejects a group with a null memoir list", () => {
    const bad = {
      localMemory: {
        ...group.localMemory,
        anthologies: { "0x12345678901234567890": null },
      },
    } as unknown as LoadedJson;
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(bad, sender))
    );
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });

  test("rejects a group with null userContracts", () => {
    const bad = {
      localMemory: {
        ...group.localMemory,
        userContracts: null,
      },
    } as unknown as LoadedJson;
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(bad, sender))
    );
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });

  test("rejects a null memoir inside a group", () => {
    const bad = {
      localMemory: {
        ...group.localMemory,
        anthologies: { "0x12345678901234567890": [null] },
      },
    } as unknown as LoadedJson;
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(bad, sender))
    );
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });

  test("rejects a payload with both anthology and localMemory", () => {
    const both = { ...single, ...group } as unknown as LoadedJson;
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(both, sender))
    );
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });

  test("rejects a memoir missing required string fields", () => {
    const bad = {
      anthology: {
        ...single.anthology,
        anthology: [{ sender: "0x0", title: "t", timestamp: "1" }],
      },
    } as unknown as LoadedJson;
    const bytes = new TextEncoder().encode(
      JSON.stringify(buildShareEnvelope(bad, sender))
    );
    expect(decodeSharePayload(bytes)).toEqual({
      ok: false,
      reason: "invalid-payload",
    });
  });
});
