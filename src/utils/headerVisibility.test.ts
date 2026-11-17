import { describe, expect, test } from "bun:test";
import {
  nextHeaderScrollState,
  type HeaderScrollState,
} from "./headerVisibility";

const shown: HeaderScrollState = { hidden: false, anchorY: 0 };
const hidden: HeaderScrollState = { hidden: true, anchorY: 200 };

describe("nextHeaderScrollState", () => {
  test("keeps the header visible near the top of the page", () => {
    expect(nextHeaderScrollState(hidden, 40).hidden).toBe(false);
    expect(nextHeaderScrollState(hidden, 0).hidden).toBe(false);
  });

  test("hides after scrolling down past the top band", () => {
    expect(nextHeaderScrollState(shown, 120).hidden).toBe(true);
  });

  test("reveals on an upward scroll gesture", () => {
    expect(nextHeaderScrollState(hidden, 160).hidden).toBe(false);
  });

  test("keeps its current state for small movements", () => {
    expect(nextHeaderScrollState(shown, 4).hidden).toBe(false);
    expect(nextHeaderScrollState(hidden, 204)).toEqual(hidden);
  });

  test("re-anchors after hiding so a later upward gesture still reveals", () => {
    const afterDown = nextHeaderScrollState(shown, 120);
    expect(afterDown.hidden).toBe(true);
    expect(nextHeaderScrollState(afterDown, 110).hidden).toBe(false);
  });
});
