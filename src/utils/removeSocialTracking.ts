import { isValidURL } from "./isValidURL";

/**
 * Removes the &SI parameter from a given YouTube URL.
 *
 * @param {string} url The YouTube URL to process.
 * @returns {string} The URL with the &SI parameter removed.
 */
export const removeSocialTracking = (url: string): string => {
  // Check if the input is a string (TypeScript will enforce this at compile-time)
  if (typeof url !== "string") {
    throw new Error("Input must be a string");
  }

  if (!isValidURL(url)) {
    console.log("Invalid URL:", url);
    return url;
  }

  try {
    // Use URL API to break down the URL into its components
    const urlObject = new URL(url);

    // Check if the URL is a YouTube URL
    if (["www.youtube.com", "youtu.be"].includes(urlObject.hostname)) {
      // Get the query parameters
      const params = urlObject.searchParams;

      // Remove the SI parameter if it exists
      params.delete("si");

      // Reconstruct the URL without the SI parameter
      if (params.toString() === "") {
        urlObject.search = ""; // Remove the '?' character if there are no query parameters
      } else {
        urlObject.search = "?" + params.toString();
      }

      // Return the updated URL
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
