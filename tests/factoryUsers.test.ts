import { describe, expect, test } from "bun:test";
import { getUsersFetchPlan } from "../src/utils/factoryUsers";

describe("getUsersFetchPlan", () => {
  test("fetches only the unsynced range", () => {
    expect(getUsersFetchPlan(8, 5, 5)).toEqual({
      offset: 5,
      limit: 3,
      nextCP: 8,
    });
  });

  test("does nothing when the cursor is current and users exist", () => {
    expect(getUsersFetchPlan(5, 5, 5)).toBeNull();
  });

  test("refetches all users when the cursor is current but the list is empty", () => {
    expect(getUsersFetchPlan(5, 5, 0)).toEqual({
      offset: 0,
      limit: 5,
      nextCP: 5,
    });
  });

  test("resets an ahead or corrupted cursor", () => {
    expect(getUsersFetchPlan(5, 8, 3)).toEqual({
      offset: 0,
      limit: 5,
      nextCP: 5,
    });
    expect(getUsersFetchPlan(5, Number.NaN, 3)).toEqual({
      offset: 0,
      limit: 5,
      nextCP: 5,
    });
    expect(getUsersFetchPlan(5, undefined, 3)).toEqual({
      offset: 0,
      limit: 5,
      nextCP: 5,
    });
  });

  test("does nothing when the factory has no users", () => {
    expect(getUsersFetchPlan(0, 0, 0)).toBeNull();
  });

  test("rejects an invalid factory checkpoint", () => {
    expect(() => getUsersFetchPlan(Number.NaN, 0, 0)).toThrow(
      "Invalid factory users checkpoint"
    );
  });
});
