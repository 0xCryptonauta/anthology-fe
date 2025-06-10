import { SkinType } from "@src/types/common";
import React from "react";

// Define the component props interface
interface SelectorProps {
  value: SkinType;
  onChange: (value: SkinType) => void;
}

const skinOptions = ["media", "text", "json", "list", "playlist"];

// Define the component
export const SkinSelector = ({ value, onChange }: SelectorProps) => {
  // Handle the change event
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as unknown as SkinType;
    onChange(selectedValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{
        //appearance: "none",
        backgroundColor: "#f9f9f9",
        color: "#111",
        padding: "6px",
        borderRadius: "8px",
        border: "1px solid #e2e2e2",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        //WebkitAppearance: "none",
        //MozAppearance: "none",
        margin: "0px 10px",
        paddingRight: "0px",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
    >
      {skinOptions.map((option) => (
        <option key={option} value={option} style={{ backgroundColor: "#fff" }}>
          {option[0].toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );
};
