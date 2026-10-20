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
      }}
    >
      <span>© 2026 - InBytes.xyz</span>

      <span style={{ fontSize: "0.7rem" }}>{t("footer.tagline")}</span>
    </footer>
  );
};
