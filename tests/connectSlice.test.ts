import { describe, expect, test } from "bun:test";
import {
  connectSlice,
  ensureDeviceId,
  setNametag,
} from "../src/store/slices/connectSlice";

const reducer = connectSlice.reducer;
const init = { type: "@@INIT" };

describe("connectSlice", () => {
  test("ensureDeviceId sets a 1x id once", () => {
    let state = reducer(undefined, init);
    state = reducer(state, ensureDeviceId());
    expect(state.deviceId).toMatch(/^1x[0-9a-f]{20}$/);
    const first = state.deviceId;
    state = reducer(state, ensureDeviceId());
    expect(state.deviceId).toBe(first);
  });

  test("setNametag trims and caps at 13 chars", () => {
    let state = reducer(undefined, init);
    state = reducer(state, setNametag("  Ana  "));
    expect(state.nametag).toBe("Ana");
    state = reducer(state, setNametag("x".repeat(40)));
    expect(state.nametag).toHaveLength(13);
  });
});
