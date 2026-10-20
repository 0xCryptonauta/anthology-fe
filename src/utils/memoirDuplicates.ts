import { MemoirInterface } from "@src/store/slices/anthologySlice";
import { detectEmbed, extractFirstUrl, EmbedMatch } from "./embeds";

const toURL = (raw: string): URL | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    return new URL(
      /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    );
  } catch {
    return null;
  }
};

/**
 * Builds a stable comparison key for embeddable URLs.
 *
 * Uses the provider's canonical identifier so the same media shared through
 * different URL shapes (e.g. `youtube.com/watch`, `youtu.be`, `/shorts`)
 * compares equal, while distinct IDs stay distinct. IDs are case-sensitive
 * and must not be lowercased.
 */
const embedComparisonKey = (embed: EmbedMatch): string => {
  switch (embed.provider) {
    case "youtube":
      return `youtube:video:${embed.videoId}`;
    case "vimeo":
      return `vimeo:${embed.videoId}`;
    case "spotify":
      return `spotify:${embed.contentType}:${embed.contentId}`;
    case "twitter":
      return `twitter:${embed.postId}`;
    case "reddit":
      return `reddit:${embed.postUrl.toLowerCase()}`;
    case "facebook":
      return `facebook:${embed.postUrl}`;
    case "instagram":
      return `instagram:${embed.postUrl}`;
    case "archiveorg":
      return `archiveorg:${embed.itemId}`;
    default: {
      const exhaustiveCheck: never = embed;
      return exhaustiveCheck;
    }
  }
};

const isYouTubeHost = (host: string): boolean =>
  host === "youtube.com" || host.endsWith(".youtube.com");

/**
 * Normalizes a URL for duplicate comparison.
 *
 * Embeddable media URLs are reduced to their provider + canonical ID so video
 * identity (which lives in the query string for YouTube `watch` links) is not
 * lost. Other URLs drop protocol, `www.`, query params, hashes and trailing
 * slashes, and lowercase host and path.
 */
export const normalizeUrlForComparison = (raw: string): string | null => {
  const embed = detectEmbed(raw);
  if (embed) return embedComparisonKey(embed);

  const url = toURL(raw);
  if (!url) return null;

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname.replace(/\/+$/, "");

  // `detectEmbed` only recognizes single videos. Preserve the distinct
  // identity of YouTube links whose ID lives in the query string so different
  // videos/playlists never collapse into the same comparison key.
  if (isYouTubeHost(host)) {
    if (path === "/watch") {
      const videoId = url.searchParams.get("v");
      if (videoId) return `youtube:video:${videoId}`;
    }

    if (path === "/playlist") {
      const listId = url.searchParams.get("list");
      if (listId) return `youtube:playlist:${listId}`;
    }
  }

  return `${host}${path.toLowerCase()}`;
};

/** True when the memoir contains the same URL as `normalizedUrl`. */
export const memoirHasUrl = (
  memoir: MemoirInterface,
  normalizedUrl: string
): boolean => {
  const existingUrl = extractFirstUrl(memoir.content);
  if (!existingUrl) return false;

  return normalizeUrlForComparison(existingUrl) === normalizedUrl;
};
