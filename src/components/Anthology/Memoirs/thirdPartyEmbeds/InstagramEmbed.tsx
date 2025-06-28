import { Loading } from "@src/components/Layout/Loading";
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

const isInstagramReelOrPost = (url: string) =>
  /instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/i.test(url);

const InstagramEmbed: React.FC<InstagramEmbedProps> = ({ postUrl }) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.25 }
    );

    if (embedRef.current) {
      observer.observe(embedRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !isInstagramReelOrPost(postUrl)) return;

    setIsLoading(true);
    const timeout = setTimeout(() => setHasError(true), 5000);

    const isScriptPresent = !!document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    );

    if (!window.instgrm && !isScriptPresent) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;

      script.onload = () => {
        clearTimeout(timeout);
        setIsLoading(false);
        window.instgrm?.Embeds.process();
      };

      script.onerror = () => {
        clearTimeout(timeout);
        setHasError(true);
        setIsLoading(false);
      };

      document.body.appendChild(script);
      scriptRef.current = script;
    } else {
      clearTimeout(timeout);
      setIsLoading(false);
      window.instgrm?.Embeds.process();
    }

    return () => {
      clearTimeout(timeout);
      const currentScript = scriptRef.current;
      if (
        currentScript &&
        currentScript.parentNode &&
        currentScript.parentNode.contains(currentScript)
      ) {
        currentScript.parentNode.removeChild(currentScript);
      }
    };
  }, [isInView, postUrl]);

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

  return (
    <div ref={embedRef} style={containerStyle}>
      {isLoading && <Loading />}
      {isInView && (
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={postUrl}
          data-instgrm-version="14"
          style={blockquoteStyle}
        ></blockquote>
      )}
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  position: "relative",
  //borderRadius: "12px",
  padding: "3px",
  //boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "center",
  //minHeight: "200px",
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
