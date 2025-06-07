import { SkinType } from "@src/types/common";
import React from "react";

// Define the component props interface
interface SelectorProps {
  value: SkinType;
  onChange: (value: SkinType) => void;
}

const skinOptions = ["text", "media", "json", "list", "playlist"];

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
        border: "1px solid white",
        padding: "3px",
        borderRadius: "7px",
        cursor: "pointer",
        marginRight: "10px",
        backgroundColor: "unset",
        height: "32px",
      }}
    >
      {skinOptions.map((option) => (
        <option key={option} value={option}>
          {option[0].toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  );
};
