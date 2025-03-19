import React, { useEffect, useRef, useState } from "react";

interface FacebookEmbedProps {
  postUrl: string;
}

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
    };
  }
}

// Regex to detect Facebook video, watch, or post URLs
const isFacebookVideo = (url: string) =>
  /facebook\.com\/(?:\w+\/videos\/\d+|watch\?v=\d+)/i.test(url);

const FacebookEmbed: React.FC<FacebookEmbedProps> = ({ postUrl }) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasError(true), 5000); // Error after 5 seconds if embed fails

    const loadScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0";
      script.async = true;

      script.onload = () => {
        setIsLoading(false);
        clearTimeout(timeout);
        window.FB?.XFBML.parse(embedRef.current || undefined);
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

    if (!window.FB) {
      loadScript();
    } else {
      setIsLoading(false);
      window.FB.XFBML.parse(embedRef.current || undefined);
    }

    return () => clearTimeout(timeout);
  }, []);

  if (hasError) {
    return (
      <div style={errorStyle}>
        Failed to load Facebook content.{" "}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          View on Facebook
        </a>
      </div>
    );
  }

  // Render video URLs with <iframe> for better compatibility
  if (isFacebookVideo(postUrl)) {
    return (
      <div style={containerStyle}>
        <iframe
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
            postUrl
          )}&show_text=false`}
          width="300"
          style={iframeStyle}
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Render posts using Facebook's embed method
  return (
    <div ref={embedRef} style={containerStyle}>
      {isLoading && <div style={spinnerStyle}>Loading...</div>}
      <div
        className="fb-post"
        data-href={postUrl}
        data-width="300"
        data-show-text="true"
      ></div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: "relative",
  //backgroundColor: "#f6f7f8",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
};

const spinnerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "16px",
  color: "#888",
};

const iframeStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "12px",
  width: "100%",
  maxWidth: "500px",
};

const errorStyle: React.CSSProperties = {
  color: "#d9534f",
  padding: "12px",
  border: "1px solid #d9534f",
  borderRadius: "8px",
  textAlign: "center",
};

const linkStyle: React.CSSProperties = {
  color: "#1877F2",
  textDecoration: "underline",
};

export default FacebookEmbed;
