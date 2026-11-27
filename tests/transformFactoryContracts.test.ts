import { describe, expect, test } from "bun:test";
import type { Address } from "../src/types/common";
import { transformFactoryContracts } from "../src/utils/transformData";

const address = (character: string) =>
  `0x${character.repeat(40)}` as Address;

const userOne = address("1");
const userTwo = address("2");
const contractOne = address("a");
const contractTwo = address("b");

describe("transformFactoryContracts", () => {
  test("maps valid user contracts and titles", () => {
    expect(
      transformFactoryContracts(
        [[[contractOne], [contractTwo]], [["Title A"], ["Title B"]]],
        [userOne, userTwo]
      )
    ).toEqual({
      userContracts: {
        [userOne]: [contractOne],
        [userTwo]: [contractTwo],
      },
      titles: {
        [contractOne]: "Title A",
        [contractTwo]: "Title B",
      },
    });
  });

  test("rejects an undefined response", () => {
    expect(() => transformFactoryContracts(undefined, [userOne])).toThrow(
      "Invalid factory contracts response"
    );
  });

  test("rejects a response without the title array", () => {
    expect(() => transformFactoryContracts([[[contractOne]]], [userOne])).toThrow(
      "Invalid factory contracts response"
    );
  });

  test("rejects a non-array user-contract entry", () => {
    expect(() =>
      transformFactoryContracts([[contractOne], [["Title A"]]], [userOne])
    ).toThrow("Invalid factory contracts response");
  });

  test("rejects a response with fewer rows than requested users", () => {
    expect(() =>
      transformFactoryContracts(
        [[[contractOne]], [["Title A"]]],
        [userOne, userTwo]
      )
    ).toThrow("Invalid factory contracts response");
  });
});
