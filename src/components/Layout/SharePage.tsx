import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const SharePage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const title = searchParams.get("title");
    const text = searchParams.get("text");
    const url = searchParams.get("url");

    console.log("Title:", title);
    console.log("Text:", text);
    console.log("URL:", url);

    // You can now use this data in your UI
  }, [searchParams]);

  const title = searchParams.get("title");
  const text = searchParams.get("text");
  const url = searchParams.get("url");

  return (
    <div>
      <h1>Shared Content</h1>
      <p>Title: {title || "No title provided"}</p>
      <p>Text: {text || "No text provided"}</p>
      <p>
        URL:{" "}
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        ) : (
          "No URL provided"
        )}
      </p>
    </div>
  );
};
