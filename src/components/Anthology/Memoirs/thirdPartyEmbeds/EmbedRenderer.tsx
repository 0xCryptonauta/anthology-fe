import { useState } from "react";
import type { EmbedMatch } from "@src/utils/embeds";
import {
  getEmbedSourceUrl,
  getSocialEmbedProvider,
} from "@src/utils/socialEmbedProviders";
import { useAppDispatch, useAppSelector } from "@src/store/utils/hooks";
import { setSocialEmbedAllowed } from "@src/store/slices/dappSlice";
import { useTranslation } from "@src/i18n/useTranslation";
import { TwitterEmbed } from "./TwitterEmbed";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { VimeoEmbed } from "./VimeoEmbed";
import { ArchiveOrgEmbed } from "./ArchiveOrgEmbed";
import RedditEmbed from "./RedditEmbed";
import FacebookEmbed from "./facebookEmbed";
import InstagramEmbed from "./InstagramEmbed";
import { SpotifyEmbed } from "./SpotifyEmbed";

const NO_ALLOWED_PROVIDERS: string[] = [];

/**
 * Renders the embed for a detected social / media URL.
 *
 * Third-party content is gated: nothing is requested from the provider until
 * the user loads it once or permanently allows that provider in Settings.
 * Detection lives in `@src/utils/embeds` — this component only handles consent
 * and maps a match to its embed component.
 */
export const EmbedRenderer = ({ embed }: { embed: EmbedMatch }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allowedProviders = useAppSelector(
    (state) => state.dapp.allowedSocialEmbeds ?? NO_ALLOWED_PROVIDERS
  );
  const [sessionAllowed, setSessionAllowed] = useState(false);

  const provider = getSocialEmbedProvider(embed.provider);
  const providerName = provider?.name ?? embed.provider;
  const isAllowed =
    sessionAllowed || allowedProviders.includes(embed.provider);

  if (!isAllowed) {
    const sourceUrl = getEmbedSourceUrl(embed);

    return (
      <div
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#f1f5f9",
          color: "#111827",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: "0.95rem" }}>
          {t("embed.consentTitle", { provider: providerName })}
        </p>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: "0.85rem",
            lineHeight: 1.45,
            color: "#334155",
          }}
        >
          {t("embed.consentBody", { provider: providerName })}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => setSessionAllowed(true)}
            style={{
              backgroundColor: "#111827",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("embed.loadOnce")}
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(
                setSocialEmbedAllowed({
                  provider: embed.provider,
                  allowed: true,
                })
              );
              setSessionAllowed(true);
            }}
            style={{
              backgroundColor: "#e2e8f0",
              color: "#111827",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("embed.alwaysAllow", { provider: providerName })}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            fontSize: "0.8rem",
          }}
        >
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1d4ed8" }}
          >
            {t("embed.openOn", { provider: providerName })}
          </a>
          {provider && (
            <a
              href={provider.policyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1d4ed8" }}
            >
              {t("embed.officialPolicy")}
            </a>
          )}
        </div>

        <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: "#475569" }}>
          {t("embed.policyHint")}
        </p>
      </div>
    );
  }

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
