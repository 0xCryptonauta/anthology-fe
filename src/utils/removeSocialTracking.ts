import { isValidURL } from "./isValidURL";

/**
 * Removes known social tracking parameters from URLs.
 *
 * Supports YouTube, Instagram, Facebook, Twitter/X, Reddit, Spotify.
 *
 */
export const removeSocialTracking = (url: string): string => {
  if (typeof url !== "string") {
    throw new Error("Input must be a string");
  }

  if (!isValidURL(url)) {
    console.log("Invalid URL:", url);
    return url;
  }

  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.toLowerCase();

    const socialHostnames = [
      "youtube.com",
      "youtu.be",
      "instagram.com",
      "facebook.com",
      "twitter.com",
      "x.com",
      "reddit.com",
      "redd.it",
      "spotify.com",
    ];

    const trackingParams = [
      // YouTube - Spotify
      "si",

      // Instagram
      "igsh",

      // Facebook
      "fbclid",

      // Twitter/X
      "t",
      "s",

      // Reddit
      "utm_source",
      "utm_medium",
      "utm_name",
      "context",
      "ref_source",

      // Generic UTM
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    const isSocialHost = socialHostnames.some((host) =>
      hostname.endsWith(host)
    );

    if (isSocialHost) {
      const params = urlObject.searchParams;

      trackingParams.forEach((param) => params.delete(param));

      urlObject.search = params.toString() ? "?" + params.toString() : "";

      return urlObject.href;
    }

    return url;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid URL");
    }
    throw error;
  }
};
