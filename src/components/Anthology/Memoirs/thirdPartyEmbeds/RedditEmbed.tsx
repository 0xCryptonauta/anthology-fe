import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

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
  const embedRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  useEffect(() => {
    if (!inView) return;

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
  }, [inView]);

  return (
    <div
      ref={(node) => {
        inViewRef(node);
        embedRef.current = node;
      }}
      style={{ backgroundColor: "none", overflowWrap: "break-word" }}
    >
      <blockquote className="reddit-embed" data-embed-height="fit-content">
        <a href={postUrl}>Reddit Post</a>
      </blockquote>
    </div>
  );
};

export default RedditEmbed;
