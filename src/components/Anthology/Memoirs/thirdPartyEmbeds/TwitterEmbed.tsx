import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import "./TwitterEmbed.css";

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
  const tweetRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  useEffect(() => {
    if (!inView) return;

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
  }, [inView]);

  return (
    <div
      ref={(node) => {
        inViewRef(node);
        tweetRef.current = node;
      }}
      className="twitter-embed-wrapper"
      style={{
        backgroundColor: "none",
        width: "100%",
        maxWidth: "550px",
        margin: "0 auto",
      }}
    >
      <blockquote className="twitter-tweet">
        <a
          href={"https://twitter.com/" + username + "/status/" + postId}
          aria-label={"View post on X: @" + username}
        >
          View post on X
        </a>
      </blockquote>
    </div>
  );
};
