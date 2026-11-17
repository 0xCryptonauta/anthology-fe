import { describe, expect, test } from "bun:test";
import { detectEmbed } from "../src/utils/embeds";

describe("detectEmbed — YouTube orientation", () => {
  test("marks /shorts/<id> as vertical", () => {
    expect(detectEmbed("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toEqual({
      provider: "youtube",
      videoId: "dQw4w9WgXcQ",
      vertical: true,
    });
  });

  test("keeps a normal watch URL horizontal", () => {
    expect(
      detectEmbed("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toEqual({
      provider: "youtube",
      videoId: "dQw4w9WgXcQ",
      vertical: false,
    });
  });

  test("keeps youtu.be short links horizontal", () => {
    expect(detectEmbed("https://youtu.be/dQw4w9WgXcQ")).toEqual({
      provider: "youtube",
      videoId: "dQw4w9WgXcQ",
      vertical: false,
    });
  });
});
