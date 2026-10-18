import { useTranslation } from "@src/i18n/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#222222",
        height: "60px",
      }}
    >
      <span>© 2026 - InBytes.xyz</span>

      <span style={{ fontSize: "0.7rem" }}>{t("footer.tagline")}</span>
    </div>
  );
};
