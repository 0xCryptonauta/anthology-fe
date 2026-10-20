import { isValidURL } from "./isValidURL";

/**
 * Removes social tracking parameters from every HTTP(S) URL in a string.
 *
 * Each provider keeps only the query params needed to open the content
 * (video/playlist IDs, timestamps, comment context, search terms). Every other
 * param is dropped, so newly invented tracking names (`exln`, `mibextid`,
 * `share_id`, …) are handled without a denylist entry. The cleanup runs in
 * place, leaving any text around the URL untouched.
 */

type SocialProvider = {
  hosts: string[];
  keepParams: string[];
};

const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    hosts: ["youtube.com", "youtu.be"],
    keepParams: [
      "v",
      "list",
      "index",
      "t",
      "start",
      "end",
      "time_continue",
      "start_radio",
      "playnext",
      "search_query",
      "sp",
    ],
  },
  {
    hosts: ["instagram.com"],
    keepParams: ["img_index", "hl"],
  },
  {
    hosts: ["facebook.com"],
    keepParams: [
      "v",
      "story_fbid",
      "id",
      "fbid",
      "set",
      "type",
      "comment_id",
      "reply_comment_id",
      "q",
    ],
  },
  {
    hosts: ["twitter.com", "x.com"],
    keepParams: ["q", "f"],
  },
  {
    hosts: ["reddit.com", "redd.it"],
    keepParams: [
      "context",
      "sort",
      "limit",
      "q",
      "restrict_sr",
      "t",
      "type",
      "include_over_18",
      "solution",
    ],
  },
  {
    hosts: ["spotify.com"],
    keepParams: ["highlight", "context"],
  },
];

const URL_IN_TEXT_REGEX = /https?:\/\/\S+/gi;
// Punctuation that usually belongs to the surrounding prose, not the URL.
const TRAILING_PUNCTUATION_REGEX = /[.,;:!?)\]}>"'`]+$/;

const hostMatches = (hostname: string, domains: string[]): boolean =>
  domains.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

const cleanSocialUrl = (rawUrl: string): string => {
  if (!isValidURL(rawUrl)) return rawUrl;

  try {
    const urlObject = new URL(rawUrl);
    const hostname = urlObject.hostname.toLowerCase();
    const provider = SOCIAL_PROVIDERS.find(({ hosts }) =>
      hostMatches(hostname, hosts)
    );

    if (!provider) return rawUrl;

    const params = urlObject.searchParams;
    for (const param of [...params.keys()]) {
      if (!provider.keepParams.includes(param)) params.delete(param);
    }

    urlObject.search = params.toString() ? `?${params.toString()}` : "";

    return urlObject.href;
  } catch {
    return rawUrl;
  }
};

export const removeSocialTracking = (content: string): string => {
  if (typeof content !== "string") {
    throw new Error("Input must be a string");
  }

  return content.replace(URL_IN_TEXT_REGEX, (match) => {
    const trailing = match.match(TRAILING_PUNCTUATION_REGEX)?.[0] ?? "";
    const rawUrl = trailing ? match.slice(0, -trailing.length) : match;

    return cleanSocialUrl(rawUrl) + trailing;
  });
};
