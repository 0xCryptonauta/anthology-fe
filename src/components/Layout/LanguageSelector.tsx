import { useTranslation } from "@src/i18n/useTranslation";
import type { LocalePreference } from "@src/store/slices/dappSlice";

const options: {
  value: LocalePreference;
  labelKey: "language.auto" | "language.english" | "language.spanish";
}[] = [
  { value: "auto", labelKey: "language.auto" },
  { value: "en", labelKey: "language.english" },
  { value: "es", labelKey: "language.spanish" },
];

export const LanguageSelector = () => {
  const { t, localePref, setLocale } = useTranslation();

  return (
    <select
      value={localePref}
      onChange={(event) =>
        setLocale(event.target.value as LocalePreference)
      }
      aria-label={t("language.title")}
      style={{
        minHeight: "40px",
        padding: "8px 10px",
        borderRadius: "8px",
        border: "1px solid #30363d",
        backgroundColor: "#0d1117",
        color: "white",
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  );
};
