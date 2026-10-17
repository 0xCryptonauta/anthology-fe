import type { EmbedMatch } from "@src/utils/embeds";
import { TwitterEmbed } from "./TwitterEmbed";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { VimeoEmbed } from "./VimeoEmbed";
import { ArchiveOrgEmbed } from "./ArchiveOrgEmbed";
import RedditEmbed from "./RedditEmbed";
import FacebookEmbed from "./facebookEmbed";
import InstagramEmbed from "./InstagramEmbed";
import { SpotifyEmbed } from "./SpotifyEmbed";

/**
 * Renders the embed for a detected social / media URL.
 * Detection lives in `@src/utils/embeds` — this component only maps a match
 * to its embed component.
 */
export const EmbedRenderer = ({ embed }: { embed: EmbedMatch }) => {
  switch (embed.provider) {
    case "youtube":
      return <YoutubeEmbed videoId={embed.videoId} />;
    case "vimeo":
      return <VimeoEmbed videoId={embed.videoId} hash={embed.hash} />;
    case "archiveorg":
      return <ArchiveOrgEmbed itemId={embed.itemId} />;
    case "twitter":
      return <TwitterEmbed username={embed.username} postId={embed.postId} />;
    case "reddit":
      return <RedditEmbed postUrl={embed.postUrl} />;
    case "facebook":
      return <FacebookEmbed postUrl={embed.postUrl} />;
    case "instagram":
      return <InstagramEmbed postUrl={embed.postUrl} />;
    case "spotify":
      return (
        <SpotifyEmbed
          contentType={embed.contentType}
          contentId={embed.contentId}
        />
      );
    default:
      return null;
  }
};
