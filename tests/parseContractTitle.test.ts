import { describe, expect, test } from "bun:test";
import { parseContractTitle } from "../src/utils/parseContractsCategories";

describe("parseContractTitle", () => {
  test("splits category, subcategory, and title", () => {
    expect(parseContractTitle("[Poetry][Haiku]Spring Rain")).toEqual({
      category: "Poetry",
      subcategory: "Haiku",
      title: "Spring Rain",
    });
  });

  test("splits category-only titles", () => {
    expect(parseContractTitle("[Essays]The Long Road")).toEqual({
      category: "Essays",
      subcategory: null,
      title: "The Long Road",
    });
  });

  test("leaves plain titles alone", () => {
    expect(parseContractTitle("My Anthology")).toEqual({
      category: null,
      subcategory: null,
      title: "My Anthology",
    });
  });

  test("leaves blank titles alone", () => {
    expect(parseContractTitle("  ")).toEqual({
      category: null,
      subcategory: null,
      title: "  ",
    });
  });
});
