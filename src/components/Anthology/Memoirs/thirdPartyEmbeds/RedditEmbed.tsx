import React, { useEffect, useRef } from "react";

interface RedditEmbedProps {
  postUrl: string;
}

declare global {
  interface Window {
    __redditEmbedWidget?: {
      init: () => void;
    };
  }
}

const RedditEmbed: React.FC<RedditEmbedProps> = ({ postUrl }) => {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.__redditEmbedWidget) {
      const script = document.createElement("script");
      script.src = "https://embed.redditmedia.com/widgets/platform.js";
      script.async = true;

      script.onload = () => {
        window.__redditEmbedWidget?.init();
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <div
      ref={embedRef}
      style={{ backgroundColor: "none", overflowWrap: "break-word" }}
    >
      <blockquote className="reddit-embed" data-embed-height="fit-content">
        <a href={postUrl}>Reddit Post</a>
      </blockquote>
    </div>
  );
};

export default RedditEmbed;
