import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

const SITE_NAME = "Anthology";
const DEFAULT_TITLE = "Anthology";
const DEFAULT_DESCRIPTION = "A local-first Progressive Web App for capturing, organizing and sharing personal knowledge.";
const DEFAULT_IMAGE = "https://memory.inbytes.xyz/og-image.png";
const BASE_URL = "https://memory.inbytes.xyz";

export const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = BASE_URL,
  type = "website",
}: SeoProps) => {
  const resolvedTitle =
    title === DEFAULT_TITLE ? title : `${title} — ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:logo" content="https://memory.inbytes.xyz/IB_icon.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
