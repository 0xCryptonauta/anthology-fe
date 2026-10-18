import { detectEmbed, extractFirstUrl } from "./embeds";

/**
 * Fetches a human-readable title for a media/social URL using public
 * CORS-enabled oEmbed / metadata endpoints (no backend required).
 * Returns null if no title could be resolved.
 */
export const fetchUrlTitle = async (content: string): Promise<string | null> => {
  const url = extractFirstUrl(content);
  if (!url) return null;

  const embed = detectEmbed(url);

  // 1. Archive.org metadata API
  if (embed?.provider === "archiveorg") {
    try {
      const res = await fetch(
        `https://archive.org/metadata/${encodeURIComponent(embed.itemId)}`
      );
      if (res.ok) {
        const data = await res.json();
        const rawTitle = data?.metadata?.title;
        const title = Array.isArray(rawTitle) ? rawTitle[0] : rawTitle;
        if (typeof title === "string" && title.trim()) {
          return title.trim().slice(0, 50);
        }
      }
    } catch {
      // fall through
    }
  }

  // 2. Spotify public oEmbed endpoint
  if (embed?.provider === "spotify") {
    try {
      const res = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (typeof data?.title === "string" && data.title.trim()) {
          return data.title.trim().slice(0, 50);
        }
      }
    } catch {
      // fall through
    }
  }

  // 3. Universal noembed.com (YouTube, Vimeo, SoundCloud, Reddit, Twitter, etc.)
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(url)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.title === "string" && data.title.trim()) {
        return data.title.trim().slice(0, 50);
      }
    }
  } catch {
    // ignore network errors
  }

  return null;
};
