import { describe, expect, test } from "bun:test";
import { getExternalLinkTarget } from "../src/utils/externalLink";

const BASE = "https://memory.inbytes.xyz/";

describe("getExternalLinkTarget", () => {
  test("ignores same-origin and in-page links", () => {
    expect(getExternalLinkTarget("/settings", null, BASE)).toBeNull();
    expect(
      getExternalLinkTarget("https://memory.inbytes.xyz/about", null, BASE)
    ).toBeNull();
    expect(getExternalLinkTarget("#main-content", null, BASE)).toBeNull();
    expect(getExternalLinkTarget("", null, BASE)).toBeNull();
    expect(getExternalLinkTarget(null, null, BASE)).toBeNull();
  });

  test("ignores unsupported protocols", () => {
    expect(getExternalLinkTarget("javascript:alert(1)", null, BASE)).toBeNull();
    expect(getExternalLinkTarget("data:text/html,hi", null, BASE)).toBeNull();
  });

  test("extracts the destination host for external pages", () => {
    expect(
      getExternalLinkTarget("https://www.youtube.com/watch?v=abc", null, BASE)
    ).toEqual({
      href: "https://www.youtube.com/watch?v=abc",
      destination: "www.youtube.com",
      newTab: false,
    });
  });

  test("marks target=_blank links as new tab", () => {
    expect(
      getExternalLinkTarget("https://arbiscan.io/address/0x123", "_blank", BASE)
        ?.newTab
    ).toBe(true);
  });

  test("treats mailto and tel as leaving the app", () => {
    expect(getExternalLinkTarget("mailto:ana@example.com", null, BASE)).toEqual({
      href: "mailto:ana@example.com",
      destination: "ana@example.com",
      newTab: false,
    });
    expect(getExternalLinkTarget("tel:+15551234567", null, BASE)).toEqual({
      href: "tel:+15551234567",
      destination: "+15551234567",
      newTab: false,
    });
  });

  test("resolves scheme-relative links against the page protocol", () => {
    expect(getExternalLinkTarget("//example.com/path", null, BASE)).toEqual({
      href: "https://example.com/path",
      destination: "example.com",
      newTab: false,
    });
  });
});
