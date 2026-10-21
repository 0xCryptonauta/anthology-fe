import { Link } from "react-router-dom";
import { useTranslation } from "@src/i18n/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#f4f4f5",
        height: "60px",
        fontSize: "0.7rem",
      }}
    >
      <span>
        © 2026 - InBytes.xyz ·{" "}
        <Link
          to="/privacy"
          style={{
            color: "#f4f4f5",
            textDecoration: "underline",
            fontSize: "inherit",
            fontWeight: 400,
          }}
        >
          {t("footer.privacy")}
        </Link>
      </span>

      <span>{t("footer.tagline")}</span>
    </footer>
  );
};
