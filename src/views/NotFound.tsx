import { Link } from "react-router-dom";
import { Seo } from "@components/Layout/Seo";
import { useTranslation } from "@src/i18n/useTranslation";
import "./NotFound.css";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title="404" description="Page not found" />
      <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">{t("notFound.subtitle")}</p>
      <p className="notfound-message">{t("notFound.message")}</p>
      <Link to="/" className="notfound-link">
        {t("notFound.back")}
      </Link>

      <footer className="notfound-footer">
        <em>{t("notFound.quote")}</em>
        <div className="notfound-quote-attribution">– Friedrich Nietzsche</div>
      </footer>
      </div>
    </>
  );
}
