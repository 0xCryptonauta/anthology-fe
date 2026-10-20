/**
 * Social / media URL parsing for embed rendering.
 *
 * Detection is based on URL structure (hostname + pathname / known id params),
 * never on query-string tracking params — so embeds keep working when
 * providers add or rename params like `si`, `igsh`, `fbclid`, `utm_*`, etc.
 */

export type SpotifyContentType =
  | "track"
  | "album"
  | "playlist"
  | "episode"
  | "show";

export type EmbedMatch =
  | { provider: "youtube"; videoId: string }
  | { provider: "vimeo"; videoId: string; hash?: string }
  | { provider: "archiveorg"; itemId: string }
  | { provider: "spotify"; contentType: SpotifyContentType; contentId: string }
  | { provider: "twitter"; username: string; postId: string }
  | { provider: "reddit"; postUrl: string }
  | { provider: "facebook"; postUrl: string }
  | { provider: "instagram"; postUrl: string };

const hostMatches = (hostname: string, domains: string[]): boolean =>
  domains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

/** Parses a URL-ish string; adds `https://` when the scheme is missing. */
const toURL = (raw: string): URL | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // URL parsers silently strip tabs/newlines, so "url\ntext" would become
  // "url/text" and swallow the surrounding text. A URL has no literal
  // whitespace; mixed content must be handled by the extraction path below.
  if (/\s/.test(trimmed)) return null;

  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withScheme);
  } catch {
    return null;
  }
};

const pathSegments = (url: URL): string[] =>
  url.pathname.split("/").filter(Boolean);

/* --------------------------------- YouTube --------------------------------- */

const YOUTUBE_DOMAINS = ["youtube.com", "youtu.be"];
const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const parseYouTube = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, YOUTUBE_DOMAINS)) return null;

  const segments = pathSegments(url);
  let videoId: string | null = null;

  if (url.hostname.endsWith("youtu.be")) {
    videoId = segments[0] ?? null;
  } else if (segments[0] === "watch") {
    videoId = url.searchParams.get("v");
  } else if (["embed", "shorts", "live", "v"].includes(segments[0])) {
    videoId = segments[1] ?? null;
  }

  if (!videoId || !YOUTUBE_ID_REGEX.test(videoId)) return null;
  return { provider: "youtube", videoId };
};

/* --------------------------------- Spotify --------------------------------- */

const SPOTIFY_DOMAINS = ["spotify.com"];
const SPOTIFY_TYPES: SpotifyContentType[] = [
  "track",
  "album",
  "playlist",
  "episode",
  "show",
];
const SPOTIFY_ID_REGEX = /^[A-Za-z0-9]{22}$/;

const parseSpotify = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, SPOTIFY_DOMAINS)) return null;

  const segments = pathSegments(url);
  // Skip an optional locale (`intl-xx`) or `embed` path prefix
  const prefix = segments[0];
  const offset = prefix?.startsWith("intl-") || prefix === "embed" ? 1 : 0;

  const contentType = segments[offset];
  const contentId = segments[offset + 1];

  if (!contentType || !contentId) return null;
  if (!SPOTIFY_TYPES.includes(contentType as SpotifyContentType)) return null;
  if (!SPOTIFY_ID_REGEX.test(contentId)) return null;

  return {
    provider: "spotify",
    contentType: contentType as SpotifyContentType,
    contentId,
  };
};

/* -------------------------------- Twitter / X ------------------------------ */

const TWITTER_DOMAINS = ["twitter.com", "x.com"];

const parseTwitter = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, TWITTER_DOMAINS)) return null;

  const segments = pathSegments(url);
  const statusIndex = segments.indexOf("status");
  if (statusIndex < 1) return null;

  let username = segments[statusIndex - 1];
  const postId = segments[statusIndex + 1];

  if (!username || !postId || !/^\d+$/.test(postId)) return null;

  // Canonical /i/web/status/<id> links
  if (username === "web" && segments[statusIndex - 2] === "i") {
    username = "i/web";
  }

  return { provider: "twitter", username, postId };
};

/* --------------------------------- Reddit ---------------------------------- */

const REDDIT_DOMAINS = ["reddit.com"];

const parseReddit = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, REDDIT_DOMAINS)) return null;

  const segments = pathSegments(url);
  const commentsIndex = segments.indexOf("comments");
  if (commentsIndex < 1) return null;

  const subreddit = segments[commentsIndex - 1];
  const postId = segments[commentsIndex + 1];
  if (!subreddit || !postId) return null;

  return {
    provider: "reddit",
    postUrl: `https://www.reddit.com/r/${subreddit}/comments/${postId}/`,
  };
};

/* -------------------------------- Facebook --------------------------------- */

const FACEBOOK_DOMAINS = ["facebook.com"];

const parseFacebook = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, FACEBOOK_DOMAINS)) return null;

  const segments = pathSegments(url);
  const watchVideoId = url.searchParams.get("v");

  if (segments[0] === "watch" && watchVideoId && /^\d+$/.test(watchVideoId)) {
    return {
      provider: "facebook",
      postUrl: `https://www.facebook.com/watch/?v=${watchVideoId}`,
    };
  }

  const postsIndex = segments.indexOf("posts");
  const videosIndex = segments.indexOf("videos");
  const idIndex =
    postsIndex !== -1 ? postsIndex + 1 : videosIndex !== -1 ? videosIndex + 1 : -1;
  const postId = idIndex !== -1 ? segments[idIndex] : undefined;

  if (!postId || !/^\d+$/.test(postId)) return null;

  return {
    provider: "facebook",
    postUrl: `https://www.facebook.com/${segments
      .slice(0, idIndex + 1)
      .join("/")}/`,
  };
};

/* -------------------------------- Instagram -------------------------------- */

const INSTAGRAM_DOMAINS = ["instagram.com"];
const INSTAGRAM_TYPES = ["p", "reel", "tv"];

const parseInstagram = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, INSTAGRAM_DOMAINS)) return null;

  const segments = pathSegments(url);
  const [type, code] = segments;

  if (!type || !INSTAGRAM_TYPES.includes(type)) return null;
  if (!code || !/^[A-Za-z0-9_-]+$/.test(code)) return null;

  // Canonical permalink without tracking params
  return {
    provider: "instagram",
    postUrl: `https://www.instagram.com/${type}/${code}/`,
  };
};

/* ---------------------------------- Vimeo ---------------------------------- */

const VIMEO_DOMAINS = ["vimeo.com"];
const VIMEO_ID_REGEX = /^\d+$/;

const parseVimeo = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, VIMEO_DOMAINS)) return null;

  const segments = pathSegments(url);

  // player.vimeo.com/video/<id> or vimeo.com/<id>[/<private hash>]
  const videoIndex = segments.indexOf("video");
  const videoId = videoIndex !== -1 ? segments[videoIndex + 1] : segments[0];
  const hash = videoIndex !== -1 ? undefined : segments[1];

  if (!videoId || !VIMEO_ID_REGEX.test(videoId)) return null;

  return {
    provider: "vimeo",
    videoId,
    hash: hash && /^[a-zA-Z0-9]+$/.test(hash) ? hash : undefined,
  };
};

/* ------------------------------- Archive.org ------------------------------- */

const ARCHIVE_DOMAINS = ["archive.org"];
const ARCHIVE_ID_REGEX = /^[A-Za-z0-9._-]+$/;

const parseArchiveOrg = (url: URL): EmbedMatch | null => {
  if (!hostMatches(url.hostname, ARCHIVE_DOMAINS)) return null;

  const segments = pathSegments(url);
  const prefixIndex = segments.findIndex(
    (segment) => segment === "details" || segment === "embed"
  );
  if (prefixIndex === -1) return null;

  const itemId = segments[prefixIndex + 1];
  if (!itemId || !ARCHIVE_ID_REGEX.test(itemId)) return null;

  return { provider: "archiveorg", itemId };
};

/* -------------------------------- Dispatcher ------------------------------- */

/**
 * Detects the embeddable provider for a memoir content string.
 * Returns `null` when the content is not a single embeddable URL.
 */
export const detectEmbed = (content: string): EmbedMatch | null => {
  if (typeof content !== "string") return null;

  const url = toURL(content);
  if (!url) return null;

  return (
    parseYouTube(url) ??
    parseVimeo(url) ??
    parseArchiveOrg(url) ??
    parseTwitter(url) ??
    parseReddit(url) ??
    parseFacebook(url) ??
    parseInstagram(url) ??
    parseSpotify(url) ??
    null
  );
};

/* -------------------------------- Extraction ------------------------------- */

const URL_IN_TEXT_REGEX = /https?:\/\/\S+/i;
const TRAILING_PUNCTUATION_REGEX = /[.,;:!?)\]}"']+$/;

/** Returns the first URL found in a string (trailing punctuation stripped). */
export const extractFirstUrl = (content: string): string | null => {
  if (typeof content !== "string") return null;
  const match = content.match(URL_IN_TEXT_REGEX);
  if (!match) return null;
  return match[0].replace(TRAILING_PUNCTUATION_REGEX, "");
};

export interface ExtractedEmbed {
  embed: EmbedMatch;
  /** Remaining text with the URL removed ("" when the content is only a URL). */
  caption: string;
}

/**
 * Extracts the first embeddable URL from a content string, whether the content
 * is exactly a URL or text mixed with one. Returns the detected embed plus the
 * leftover text as caption.
 */
export const extractEmbed = (content: string): ExtractedEmbed | null => {
  if (typeof content !== "string") return null;

  // Fast path: the whole content is one embeddable URL
  const direct = detectEmbed(content);
  if (direct) return { embed: direct, caption: "" };

  const match = content.match(URL_IN_TEXT_REGEX);
  if (!match) return null;

  // Strip punctuation that commonly follows URLs in prose
  const url = match[0].replace(TRAILING_PUNCTUATION_REGEX, "");

  const embed = detectEmbed(url);
  if (!embed) return null;

  // Remove the URL and keep the remaining text as line-based caption. Removing
  // a URL that sat on its own line leaves a blank line; drop empty lines so
  // the surrounding text stays on consecutive lines instead of gaining a gap.
  const caption = content
    .replace(match[0], "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[([{]$/, "");

  return { embed, caption };
};
