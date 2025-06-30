import React, { useEffect, useRef, useState } from "react";
import { Loading } from "@src/components/Layout/Loading";

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Lazy load with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (embedRef.current) {
      observer.observe(embedRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load Instagram embed script and render post
  useEffect(() => {
    if (!isInView || !isInstagramReelOrPost(postUrl)) return;

    setIsLoading(true);
    const timeout = setTimeout(() => {
      setHasError(true);
      setIsLoading(false);
    }, 7000);

    const embedInstagram = () => {
      clearTimeout(timeout);
      setIsLoading(false);
      window.instgrm?.Embeds.process();
    };

    const scriptSelector = 'script[src="https://www.instagram.com/embed.js"]';
    const existingScript = document.querySelector(scriptSelector);

    if (!window.instgrm && !existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = embedInstagram;
      script.onerror = () => {
        clearTimeout(timeout);
        setHasError(true);
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      embedInstagram();
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isInView, postUrl]);

  // Detect iframe load
  useEffect(() => {
    if (!isInView) return;

    const checkIframeLoaded = () => {
      const iframe = embedRef.current?.querySelector("iframe.instagram-media");
      if (iframe) {
        iframe.addEventListener("load", () => setIsLoading(false));
        return () =>
          iframe.removeEventListener("load", () => setIsLoading(false));
      }
    };

    const delay = setTimeout(checkIframeLoaded, 500); // small delay to wait for iframe to appear
    return () => clearTimeout(delay);
  }, [isInView]);

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
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          ...blockquoteStyle,
          ...(isLoading ? { display: "none" } : {}),
        }}
      ></blockquote>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  position: "relative",
  padding: "3px",
  display: "flex",
  justifyContent: "center",
};

const blockquoteStyle: React.CSSProperties = {
  margin: 0,
  width: "100%",
  maxWidth: "250px",
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
