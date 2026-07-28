import { Link } from "react-router-dom";
import { Seo } from "@components/Layout/Seo";
import "./NotFound.css";

export function NotFound() {
  return (
    <>
      <Seo title="404" description="Page not found" />
      <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Page not found</p>
      <p className="notfound-message">
        This route doesn’t exist. Maybe you mistyped the URL, or maybe we broke
        something.
      </p>
      <Link to="/" className="notfound-link">
        ← Go back home
      </Link>

      <footer className="notfound-footer">
        <em>
          “Madness is something rare in individuals — but in groups, parties,
          peoples, ages it is the rule.”
        </em>
        <div className="notfound-quote-attribution">– Friedrich Nietzsche</div>
      </footer>
      </div>
    </>
  );
}
