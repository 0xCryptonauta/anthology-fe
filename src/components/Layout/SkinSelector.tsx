import { SkinType } from "@src/types/common";
import React from "react";
import { useTranslation } from "@src/i18n/useTranslation";

// Define the component props interface
interface SelectorProps {
  value: SkinType;
  onChange: (value: SkinType) => void;
}

// Kept in English on purpose (product terms) so the control stays compact on
// mobile in every language — "Media" / "Playlist" never grow into long words.
const skinOptions = ["media", "text", "json", "list", "playlist"];

// Define the component
export const SkinSelector = ({ value, onChange }: SelectorProps) => {
  const { t } = useTranslation();

  // Handle the change event
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as unknown as SkinType;
    onChange(selectedValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      translate="no"
      aria-label={t("a11y.skinSelector")}
      style={{
        height: "36px",
        backgroundColor: "#f9f9f9",
        color: "#111",
        padding: "0 8px",
        borderRadius: "8px",
        border: "1px solid #e2e2e2",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {skinOptions.map((option) => (
        <option
          key={option}
          value={option}
          style={{ backgroundColor: "#fff" }}
        >
          {option[0].toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );
};
