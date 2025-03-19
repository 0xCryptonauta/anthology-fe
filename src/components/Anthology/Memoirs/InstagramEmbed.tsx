import React, { useEffect, useRef, useState } from "react";

interface InstagramEmbedProps {
  postUrl: string;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

// Regex for Instagram posts and reels
const isInstagramReelOrPost = (url: string) =>
  /instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/i.test(url);

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ postUrl }) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasError(true), 5000); // Error after 5s if embed fails

    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;

      script.onload = () => {
        setIsLoading(false);
        clearTimeout(timeout);
        window.instgrm?.Embeds.process();
      };

      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    if (!window.instgrm) {
      loadScript();
    } else {
      setIsLoading(false);
      window.instgrm.Embeds.process();
    }

    return () => clearTimeout(timeout);
  }, []);

  if (hasError) {
    return (
      <div style={errorStyle}>
        Failed to load Instagram content.{" "}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          View on Instagram
        </a>
      </div>
    );
  }

  if (!isInstagramReelOrPost(postUrl)) {
    return (
      <div style={errorStyle}>
        Invalid Instagram URL.{" "}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          View on Instagram
        </a>
      </div>
    );
  }

  return (
    <div ref={embedRef} style={containerStyle}>
      {isLoading && <div style={spinnerStyle}>Loading...</div>}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={blockquoteStyle}
      ></blockquote>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: "relative",
  //backgroundColor: "#f6f7f8",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "center",
};

const spinnerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "16px",
  color: "#888",
};

const blockquoteStyle: React.CSSProperties = {
  margin: 0,
  width: "100%",
  maxWidth: "300px",
};

const errorStyle: React.CSSProperties = {
  color: "#d9534f",
  padding: "12px",
  border: "1px solid #d9534f",
  borderRadius: "8px",
  textAlign: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#E1306C",
  textDecoration: "underline",
};

export default InstagramEmbed;
