import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export const TwitterEmbed = ({
  username,
  postId,
}: {
  username: string;
  postId: string;
}) => {
  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          if (window.twttr && tweetRef.current) {
            window.twttr.widgets.load(tweetRef.current);
          }
        }, 500); // Small delay for safer loading
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else if (tweetRef.current) {
      window.twttr.widgets.load(tweetRef.current);
    }
  }, []);

  return (
    <div ref={tweetRef} style={{ backgroundColor: "none" }}>
      <blockquote className="twitter-tweet">
        <a href={"https://twitter.com/" + username + "/status/" + postId}></a>
      </blockquote>
    </div>
  );
};
