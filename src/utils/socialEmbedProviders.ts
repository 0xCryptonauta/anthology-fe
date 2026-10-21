import type { EmbedMatch } from "./embeds";

export type SocialEmbedProvider = EmbedMatch["provider"];

export interface SocialEmbedProviderInfo {
  id: SocialEmbedProvider;
  name: string;
  /** Official provider privacy policy, opened in a new tab. */
  policyUrl: string;
}

/**
 * Single source of truth for embed-provider names and policy links. About,
 * Settings and the consent gate all read from here so the links cannot drift.
 */
export const SOCIAL_EMBED_PROVIDERS: SocialEmbedProviderInfo[] = [
  {
    id: "youtube",
    name: "YouTube",
    policyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "instagram",
    name: "Instagram",
    policyUrl: "https://privacycenter.instagram.com/policy/",
  },
  {
    id: "facebook",
    name: "Facebook",
    policyUrl: "https://www.facebook.com/privacy/policy/",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    policyUrl: "https://x.com/privacy",
  },
  {
    id: "reddit",
    name: "Reddit",
    policyUrl: "https://www.redditinc.com/policies/privacy-policy",
  },
  {
    id: "spotify",
    name: "Spotify",
    policyUrl: "https://www.spotify.com/legal/privacy-policy/",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    policyUrl: "https://vimeo.com/privacy",
  },
  {
    id: "archiveorg",
    name: "Internet Archive",
    policyUrl: "https://archive.org/about/terms.php",
  },
];

export const getSocialEmbedProvider = (
  id: SocialEmbedProvider
): SocialEmbedProviderInfo | undefined =>
  SOCIAL_EMBED_PROVIDERS.find((provider) => provider.id === id);

/** Canonical public URL for the "Open on …" link in the consent gate. */
export const getEmbedSourceUrl = (embed: EmbedMatch): string => {
  switch (embed.provider) {
    case "youtube":
      return `https://www.youtube.com/watch?v=${embed.videoId}`;
    case "vimeo":
      return embed.hash
        ? `https://vimeo.com/${embed.videoId}/${embed.hash}`
        : `https://vimeo.com/${embed.videoId}`;
    case "archiveorg":
      return `https://archive.org/details/${embed.itemId}`;
    case "spotify":
      return `https://open.spotify.com/${embed.contentType}/${embed.contentId}`;
    case "twitter":
      return `https://x.com/${embed.username}/status/${embed.postId}`;
    case "reddit":
    case "facebook":
    case "instagram":
      return embed.postUrl;
  }
};
