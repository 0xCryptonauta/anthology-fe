export const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*?v=)?|embed\/|shorts\/|live\/)|youtu\.be\/)(.{11})$/i;

export const SPOTIFY_REGEX =
  /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]{22})/i;

export const TWITTER_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([\w]+)\/status\/(\d+)/i;

export const REDDIT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?reddit\.com\/r\/([\w]+)\/(?:comments\/([\w]+)\/?([\w%-]*)|s\/[\w]+)\/?$/i;

export const INSTAGRAM_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/((p|reel|tv)\/[\w-]+\/?|[\w.-]+\/?)$/i;

export const FACEBOOK_REGEX =
  /^(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com\/(?:\w+\/(?:posts|videos)\/(\d+)|watch\?v=(\d+))/i;
